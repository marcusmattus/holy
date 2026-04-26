import { type Prisma } from '@prisma/client'
import { prisma } from '@/server/services/prisma'

export async function writeSettlementAuditLog(input: {
  action: string
  actorId?: string
  payload?: Record<string, unknown>
}) {
  return prisma.settlementAudit.create({
    data: {
      action: input.action,
      actorId: input.actorId,
      payload: input.payload as Prisma.InputJsonValue | undefined,
    },
  })
}
