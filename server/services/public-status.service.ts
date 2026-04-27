import { audit, makeId, phase18State } from '@/server/phase18/state'
import type { PublicComponentStatus, PublicIncidentImpact } from '@/server/phase18/types'

export function listPublicStatus() {
  return {
    components: phase18State.statusComponents,
    incidents: phase18State.incidents.filter((incident) => incident.visible),
  }
}

export function createOrUpdateComponent(name: string, slug: string, status: PublicComponentStatus, description?: string) {
  const existing = phase18State.statusComponents.find((item) => item.slug === slug)
  if (existing) {
    existing.status = status
    existing.description = description
    return existing
  }
  const component = { id: makeId('status-component'), name, slug, status, description }
  phase18State.statusComponents.push(component)
  audit('status.component.updated', { slug, status })
  return component
}

export function createPublicIncident(input: {
  title: string
  impact: PublicIncidentImpact
  summary: string
  visible?: boolean
  approvedByAdmin?: boolean
  sensitive?: boolean
}) {
  if (input.sensitive && !input.approvedByAdmin) {
    throw new Error('Sensitive incident details require admin approval before public visibility')
  }

  const incident = {
    id: makeId('incident'),
    title: input.title,
    impact: input.impact,
    status: 'INVESTIGATING' as const,
    summary: input.summary,
    visible: Boolean(input.visible && input.approvedByAdmin),
    startedAt: new Date().toISOString(),
    updates: [],
  }

  phase18State.incidents.push(incident)
  audit('status.incident.created', { incidentId: incident.id })
  return incident
}
