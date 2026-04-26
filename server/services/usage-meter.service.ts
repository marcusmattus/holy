import { BillingStatus, Prisma, UsageEventType, WorkspacePlan } from '@prisma/client'
import { prisma } from '@/server/db/client'

export async function trackUsageEvent(input: {
  workspaceId?: string
  userId?: string
  type: UsageEventType
  quantity?: number
  metadata?: Record<string, unknown>
}) {
  return prisma.usageEvent.create({
    data: {
      workspaceId: input.workspaceId,
      userId: input.userId,
      type: input.type,
      quantity: input.quantity ?? 1,
      metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
    },
  })
}

export async function getWorkspaceBillingAccount(workspaceId: string) {
  return prisma.workspaceBillingAccount.findUnique({
    where: { workspaceId },
  })
}

export async function upsertWorkspaceBillingAccount(input: {
  workspaceId: string
  plan?: WorkspacePlan
  status?: BillingStatus
}) {
  return prisma.workspaceBillingAccount.upsert({
    where: { workspaceId: input.workspaceId },
    update: {
      plan: input.plan,
      status: input.status,
    },
    create: {
      workspaceId: input.workspaceId,
      plan: input.plan ?? WorkspacePlan.FREE,
      status: input.status ?? BillingStatus.ACTIVE,
    },
  })
}

export async function summarizeUsage(workspaceId?: string) {
  const where = workspaceId ? { workspaceId } : {}
  const events = await prisma.usageEvent.findMany({ where, orderBy: { createdAt: 'desc' } })

  const totals = events.reduce<Record<string, number>>((acc, event) => {
    acc[event.type] = (acc[event.type] ?? 0) + event.quantity
    return acc
  }, {})

  return { totals, events }
}
