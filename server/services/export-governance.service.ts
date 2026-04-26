import { auditLog } from '@/server/observability/logger'

const destinationAttempts = new Map<string, number>()

export function validateExportDestination(params: {
  workspaceId: string
  destinationRegion: 'GLOBAL' | 'EU' | 'US' | 'UK'
  allowedRegions: Array<'GLOBAL' | 'EU' | 'US' | 'UK'>
}) {
  const allowed = params.allowedRegions.includes(params.destinationRegion)
  auditLog({
    action: allowed ? 'export.destination.allowed' : 'export.destination.blocked',
    actor: params.workspaceId,
    resource: params.destinationRegion,
  })

  if (!allowed) {
    throw new Error('Export destination region is not allowed')
  }
}

export function recordExportDestinationFailure(destinationId: string) {
  const attempts = (destinationAttempts.get(destinationId) ?? 0) + 1
  destinationAttempts.set(destinationId, attempts)
  return { destinationId, attempts, disabled: attempts >= 3 }
}
