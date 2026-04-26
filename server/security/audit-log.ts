import { prisma } from '@/server/db'
import type { Prisma } from '@prisma/client'

export async function writeAuditLog(input: {
  actorId?: string
  action: string
  targetType?: string
  targetId?: string
  metadata?: Record<string, unknown>
  workspaceId?: string
}) {
  await prisma.auditLog.create({
    data: {
      actorId: input.actorId,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
    },
  })

  if (input.workspaceId) {
    await prisma.workspaceAuditLog.create({
      data: {
        workspaceId: input.workspaceId,
        actorId: input.actorId,
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId,
        metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
      },
    })
  }
}
