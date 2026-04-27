import { audit, phase18State } from '@/server/phase18/state'
import type { DataRegion, RegionStatus } from '@/server/phase18/types'

export function trackRegionHealth(region: DataRegion, status: RegionStatus, metadata?: Record<string, unknown>) {
  const record = phase18State.regionControlPlanes.find((item) => item.region === region)
  if (!record) return null
  record.status = status
  record.lastHealthCheckAt = new Date().toISOString()
  if (metadata) record.metadata = metadata
  audit('region.health.updated', { region, status })
  return record
}

export function getRegionHealth() {
  return phase18State.regionControlPlanes.map(({ region, status, priority, lastHealthCheckAt }) => ({
    region,
    status,
    priority,
    lastHealthCheckAt,
  }))
}
