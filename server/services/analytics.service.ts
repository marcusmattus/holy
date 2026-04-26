import { AnalyticsEventName } from '@prisma/client'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/server/db/client'

export async function trackAnalyticsEvent(input: {
  eventName: AnalyticsEventName
  userId?: string
  projectId?: string
  listingId?: string
  source?: string
  metadata?: Record<string, unknown>
}) {
  return prisma.analyticsEvent.create({
    data: {
      eventName: input.eventName,
      userId: input.userId,
      projectId: input.projectId,
      listingId: input.listingId,
      source: input.source,
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
    },
  })
}

export async function getAnalyticsSummary(projectId?: string) {
  const where = projectId ? { projectId } : {}
  const [views, installs, purchases] = await Promise.all([
    prisma.analyticsEvent.count({ where: { ...where, eventName: AnalyticsEventName.APP_VIEW } }),
    prisma.analyticsEvent.count({
      where: { ...where, eventName: AnalyticsEventName.INSTALL_COMPLETED },
    }),
    prisma.analyticsEvent.count({
      where: { ...where, eventName: AnalyticsEventName.PURCHASE_COMPLETED },
    }),
  ])

  return {
    views,
    installs,
    purchases,
    installRate: views > 0 ? installs / views : 0,
    purchaseRate: installs > 0 ? purchases / installs : 0,
  }
}
