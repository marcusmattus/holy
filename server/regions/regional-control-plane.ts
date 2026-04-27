import { audit, makeId, phase18State } from '@/server/phase18/state'
import type { DataRegion } from '@/server/phase18/types'

export function registerRegion(region: DataRegion, name: string, priority = 100) {
  const existing = phase18State.regionControlPlanes.find((item) => item.region === region)
  if (existing) return existing
  const created = {
    id: makeId('region'),
    region,
    name,
    status: 'ACTIVE' as const,
    priority,
    lastHealthCheckAt: new Date().toISOString(),
  }
  phase18State.regionControlPlanes.push(created)
  audit('region.registered', created)
  return created
}

export function listRegions() {
  return phase18State.regionControlPlanes
}
