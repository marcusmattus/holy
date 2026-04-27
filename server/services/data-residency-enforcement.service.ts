import { routeStorage } from '@/server/data-region/storage-router'
import { routeWorkspaceToRegion, type DataRegion } from '@/server/data-region/region-router'

export interface DataResidencyAuditEvent {
  workspaceId: string
  attemptedRegion: DataRegion
  allowed: boolean
  reason?: string
  createdAt: string
}

const auditLog: DataResidencyAuditEvent[] = []

export function enforceDataResidency(workspaceId: string, region: DataRegion) {
  const routing = routeWorkspaceToRegion(workspaceId, region)
  const storage = routeStorage(region)

  const event: DataResidencyAuditEvent = {
    workspaceId,
    attemptedRegion: region,
    allowed: routing.allowed && storage.exportAllowed,
    reason: routing.reason,
    createdAt: new Date().toISOString(),
  }

  auditLog.push(event)
  return { routing, storage, event }
}

export function listDataResidencyAuditLog() {
  return auditLog
}
