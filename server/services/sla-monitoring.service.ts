import { type Prisma } from '@prisma/client'
import { prisma } from '@/server/services/prisma'

export async function recordSlaMetric(input: {
  workspaceId?: string
  metric: string
  value: number
  unit: string
  metadata?: Record<string, unknown>
}) {
  return prisma.slaMetric.create({
    data: {
      workspaceId: input.workspaceId,
      metric: input.metric,
      value: input.value,
      unit: input.unit,
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
    },
  })
}

export async function getSlaMetrics(workspaceId?: string) {
  return prisma.slaMetric.findMany({
    where: workspaceId ? { workspaceId } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 200,
  })
}
