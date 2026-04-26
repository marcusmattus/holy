import { IncidentSeverity, IncidentSource, IncidentStatus } from '@prisma/client'
import { prisma } from '@/server/db'

export async function listIncidents() {
  return prisma.incident.findMany({ include: { updates: true }, orderBy: { updatedAt: 'desc' } })
}

export async function createIncident(input: {
  title: string
  description?: string
  severity: IncidentSeverity
  source: IncidentSource
}) {
  return prisma.incident.create({
    data: {
      title: input.title,
      description: input.description,
      severity: input.severity,
      source: input.source,
      status: IncidentStatus.OPEN,
    },
  })
}

export async function addIncidentUpdate(input: {
  incidentId: string
  authorId?: string
  body: string
}) {
  return prisma.incidentUpdate.create({
    data: {
      incidentId: input.incidentId,
      authorId: input.authorId,
      body: input.body,
    },
  })
}
