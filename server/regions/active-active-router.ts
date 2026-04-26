import { phase18State } from '@/server/phase18/state'
import type { DataRegion } from '@/server/phase18/types'

export function routeToBestRegion(preferred?: DataRegion) {
  const active = phase18State.regionControlPlanes
    .filter((region) => region.status === 'ACTIVE' || region.status === 'DEGRADED')
    .sort((a, b) => b.priority - a.priority)

  if (preferred) {
    const preferredRegion = active.find((region) => region.region === preferred)
    if (preferredRegion) return preferredRegion
  }

  return active[0] ?? null
}
