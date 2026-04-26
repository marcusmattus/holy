import { prisma } from '@/server/db'

export async function collectIncidentResponseEvidence() {
  const incidents = await prisma.incident.findMany({
    include: { updates: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return {
    control: 'incident-response',
    collectedAt: new Date().toISOString(),
    data: incidents,
    immutable: true,
  }
}
