import { prisma } from '@/server/db/client'

function startOfDay(date: Date) {
  const value = new Date(date)
  value.setHours(0, 0, 0, 0)
  return value
}

function endOfDay(date: Date) {
  const value = new Date(date)
  value.setHours(23, 59, 59, 999)
  return value
}

export async function aggregateAnalyticsForDate(targetDate: Date) {
  const from = startOfDay(targetDate)
  const to = endOfDay(targetDate)

  const events = await prisma.analyticsEvent.findMany({
    where: {
      createdAt: {
        gte: from,
        lte: to,
      },
    },
  })

  const buckets = new Map<string, {
    projectId: string | null
    listingId: string | null
    date: Date
    views: number
    installs: number
    purchases: number
    revenueCents: number
    referrals: number
  }>()

  for (const event of events) {
    const key = `${event.projectId ?? 'none'}:${event.listingId ?? 'none'}:${from.toISOString()}`
    const existing = buckets.get(key) ?? {
      projectId: event.projectId,
      listingId: event.listingId,
      date: from,
      views: 0,
      installs: 0,
      purchases: 0,
      revenueCents: 0,
      referrals: 0,
    }

    if (event.eventType === 'VIEW') existing.views += 1
    if (event.eventType === 'INSTALL') existing.installs += 1
    if (event.eventType === 'PURCHASE') {
      existing.purchases += 1
      existing.revenueCents += event.revenueCents
    }
    if (event.eventType === 'REFERRAL') existing.referrals += 1

    buckets.set(key, existing)
  }

  for (const aggregate of buckets.values()) {
    const existing = await prisma.analyticsDailyAggregate.findFirst({
      where: {
        projectId: aggregate.projectId,
        listingId: aggregate.listingId,
        date: aggregate.date,
      },
    })

    if (existing) {
      await prisma.analyticsDailyAggregate.update({
        where: { id: existing.id },
        data: {
          views: aggregate.views,
          installs: aggregate.installs,
          purchases: aggregate.purchases,
          revenueCents: aggregate.revenueCents,
          referrals: aggregate.referrals,
        },
      })
      continue
    }

    await prisma.analyticsDailyAggregate.create({
      data: aggregate,
    })
  }

  return { date: from.toISOString(), processedEvents: events.length, aggregates: buckets.size }
}

export async function aggregateYesterdayAndTodayAnalytics() {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const [yesterdayResult, todayResult] = await Promise.all([
    aggregateAnalyticsForDate(yesterday),
    aggregateAnalyticsForDate(today),
  ])

  return { yesterday: yesterdayResult, today: todayResult }
}
