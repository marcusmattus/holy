import { prisma } from '@/server/db/client'

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export async function aggregateAnalyticsForWindow(windowStart: Date, windowEnd: Date) {
  const events = await prisma.analyticsEvent.findMany({
    where: {
      createdAt: {
        gte: windowStart,
        lt: windowEnd,
      },
    },
  })

  const grouped = new Map<
    string,
    {
      projectId: string | null
      listingId: string | null
      date: Date
      views: number
      installs: number
      purchases: number
      revenueCents: number
      referrals: number
    }
  >()

  for (const event of events) {
    const date = startOfDay(event.createdAt)
    const key = `${event.projectId ?? 'none'}:${event.listingId ?? 'none'}:${date.toISOString()}`
    const existing =
      grouped.get(key) ??
      {
        projectId: event.projectId ?? null,
        listingId: event.listingId ?? null,
        date,
        views: 0,
        installs: 0,
        purchases: 0,
        revenueCents: 0,
        referrals: 0,
      }

    if (event.eventType === 'LISTING_VIEW') existing.views += 1
    if (event.eventType === 'LISTING_INSTALL') existing.installs += 1
    if (event.eventType === 'LISTING_PURCHASE') {
      existing.purchases += 1
      existing.revenueCents += event.revenueCents
    }
    if (event.eventType === 'LISTING_REFERRAL') existing.referrals += 1

    grouped.set(key, existing)
  }

  for (const row of grouped.values()) {
    const existing = await prisma.analyticsDailyAggregate.findFirst({
      where: {
        projectId: row.projectId,
        listingId: row.listingId,
        date: row.date,
      },
    })

    if (existing) {
      await prisma.analyticsDailyAggregate.update({
        where: { id: existing.id },
        data: {
          views: row.views,
          installs: row.installs,
          purchases: row.purchases,
          revenueCents: row.revenueCents,
          referrals: row.referrals,
        },
      })
    } else {
      await prisma.analyticsDailyAggregate.create({ data: row })
    }
  }

  return { processedEvents: events.length, aggregateRows: grouped.size }
}

export async function aggregateYesterdayAndToday() {
  const now = new Date()
  const todayStart = startOfDay(now)
  const yesterdayStart = addDays(todayStart, -1)
  const tomorrowStart = addDays(todayStart, 1)

  const [yesterday, today] = await Promise.all([
    aggregateAnalyticsForWindow(yesterdayStart, todayStart),
    aggregateAnalyticsForWindow(todayStart, tomorrowStart),
  ])

  return { yesterday, today }
}
