import { prisma } from '@/server/db'
import type { Prisma } from '@prisma/client'

export async function trackAnalyticsEvent(input: {
  eventName: string
  actorId?: string
  workspaceId?: string
  metadata?: Record<string, unknown>
}) {
  return prisma.analyticsEvent.create({
    data: {
      eventName: input.eventName,
      actorId: input.actorId,
      workspaceId: input.workspaceId,
      metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
    },
  })
}
