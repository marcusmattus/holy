import { audit, makeId, phase18State } from '@/server/phase18/state'
import type { DataRegion } from '@/server/phase18/types'
import { requiresFailoverApproval, suggestFailoverTarget } from '@/server/regions/failover-policy'

export function proposeFailover(fromRegion: DataRegion, reason: string, toRegion?: DataRegion) {
  const target = toRegion ?? suggestFailoverTarget(fromRegion)?.region
  if (!target) throw new Error('No target region available for failover')
  const event = {
    id: makeId('failover'),
    fromRegion,
    toRegion: target,
    reason,
    status: 'PROPOSED' as const,
    metadata: { requiresApproval: requiresFailoverApproval(reason) },
    createdAt: new Date().toISOString(),
  }
  phase18State.failoverEvents.push(event)
  audit('region.failover.proposed', event)
  return event
}

export function executeFailover(eventId: string, approvedById?: string) {
  const event = phase18State.failoverEvents.find((item) => item.id === eventId)
  if (!event) throw new Error('Failover event not found')

  const requiresApproval = Boolean(event.metadata?.requiresApproval)
  if (requiresApproval && !approvedById) {
    throw new Error('Approval required for high-risk failover')
  }

  event.status = 'EXECUTED'
  event.approvedById = approvedById
  event.executedAt = new Date().toISOString()

  const from = phase18State.regionControlPlanes.find((item) => item.region === event.fromRegion)
  const to = phase18State.regionControlPlanes.find((item) => item.region === event.toRegion)
  if (from) from.status = 'DEGRADED'
  if (to) to.status = 'ACTIVE'

  audit('region.failover.executed', { eventId, approvedById })
  return event
}

export function getRegionalAuditTrail() {
  return phase18State.audits.filter((entry) => String(entry.event).startsWith('region.'))
}
