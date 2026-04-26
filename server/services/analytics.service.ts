import { AnalyticsEventName, Prisma } from '@prisma/client'
import { prisma } from '@/server/db/client'

const VALID_EVENT_NAMES = new Set(Object.values(AnalyticsEventName))

export async function trackEvent(input: {
  projectId?: string
  listingId?: string
  userId?: string
  sessionId?: string
  eventName: AnalyticsEventName | string
  source?: string
  referrer?: string
  metadata?: Record<string, unknown>
}) {
  const eventName = normalizeEventName(input.eventName)
  if (!eventName) {
    throw new Error(`Unsupported analytics event: ${input.eventName}`)
  }

  return prisma.analyticsEvent.create({
    data: {
      projectId: input.projectId,
      listingId: input.listingId,
      userId: input.userId,
      sessionId: input.sessionId,
      eventName,
      source: input.source,
      referrer: input.referrer,
      metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
    },
  })
}

export async function getProjectAnalyticsSummary(projectId: string) {
  const [views, installs, purchases, patches] = await Promise.all([
    prisma.analyticsEvent.count({ where: { projectId, eventName: 'APP_VIEW' } }).catch(() => 0),
    prisma.analyticsEvent
      .count({ where: { projectId, eventName: 'INSTALL_COMPLETED' } })
      .catch(() => 0),
    prisma.analyticsEvent
      .count({ where: { projectId, eventName: 'PURCHASE_COMPLETED' } })
      .catch(() => 0),
    prisma.analyticsEvent
      .count({ where: { projectId, eventName: 'AI_PATCH_APPLIED' } })
      .catch(() => 0),
  ])

  return {
    views,
    installs,
    purchases,
    patches,
    installConversionRate: views > 0 ? installs / views : 0,
    purchaseConversionRate: views > 0 ? purchases / views : 0,
  }
}

function normalizeEventName(eventName: AnalyticsEventName | string) {
  if (typeof eventName !== 'string') return eventName
  const upper = eventName.toUpperCase() as AnalyticsEventName
  return VALID_EVENT_NAMES.has(upper) ? upper : null
}
