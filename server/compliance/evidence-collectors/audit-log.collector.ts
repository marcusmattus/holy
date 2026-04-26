import { prisma } from '@/server/db'

export async function collectAuditLogEvidence() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return {
    control: 'audit-log',
    collectedAt: new Date().toISOString(),
    data: logs.map((log) => ({
      ...log,
      metadata: log.metadata ? '[REDACTED]' : null,
    })),
    immutable: true,
  }
}
