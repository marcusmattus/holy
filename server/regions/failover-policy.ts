import { phase18State } from '@/server/phase18/state'

const HIGH_RISK_REASONS = ['security', 'production', 'financial', 'settlement', 'data-export']

export function requiresFailoverApproval(reason: string) {
  const normalized = reason.toLowerCase()
  return HIGH_RISK_REASONS.some((tag) => normalized.includes(tag))
}

export function suggestFailoverTarget(fromRegion: string) {
  return phase18State.regionControlPlanes
    .filter((region) => region.region !== fromRegion && region.status === 'ACTIVE')
    .sort((a, b) => b.priority - a.priority)[0]
}
