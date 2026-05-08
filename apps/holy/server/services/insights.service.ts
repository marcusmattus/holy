/**
 * Holy Insights — server-side service layer
 * Analytics event ingestion, aggregation, and revenue scenario management.
 */

import { prisma } from '@/lib/db'

export type TrackEventInput = {
  projectId: string
  event: string
  path?: string
  referrer?: string
  country?: string
  device?: string
}

/**
 * Record a single analytics event (page view, conversion, install, etc.)
 */
export async function trackEvent(input: TrackEventInput) {
  return prisma.analyticsEvent.create({
    data: {
      projectId: input.projectId,
      event: input.event,
      path: input.path,
      referrer: input.referrer,
      country: input.country,
      device: input.device,
    },
  })
}

/**
 * Aggregate event counts per day for a project over the last N days.
 */
export async function getDailyEventCounts(projectId: string, days = 30) {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const events = await prisma.analyticsEvent.findMany({
    where: { projectId, createdAt: { gte: since } },
    select: { createdAt: true, event: true },
  })

  const buckets: Record<string, Record<string, number>> = {}
  for (const e of events) {
    const day = e.createdAt.toISOString().slice(0, 10)
    buckets[day] ??= {}
    buckets[day][e.event] = (buckets[day][e.event] ?? 0) + 1
  }
  return buckets
}

/**
 * Save or update a revenue scenario for a user.
 */
export async function upsertScenario(
  userId: string,
  data: {
    name: string
    monthlyVisitors: number
    conversionRate: number
    avgOrderValue: number
    revenueSharePct: number
    projectId?: string
  },
) {
  const monthly =
    data.monthlyVisitors * (data.conversionRate / 100) * data.avgOrderValue
  const annual = monthly * 12

  return prisma.revenueScenario.create({
    data: {
      userId,
      projectId: data.projectId ?? null,
      name: data.name,
      monthlyVisitors: data.monthlyVisitors,
      conversionRate: data.conversionRate,
      avgOrderValue: data.avgOrderValue,
      revenueSharePct: data.revenueSharePct,
      monthlyRevenue: monthly,
      annualRevenue: annual,
    },
  })
}
