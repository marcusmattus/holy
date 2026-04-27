import { createId, store, writeAuditEvent } from '@/server/core/in-memory-store'
import type { RemediationAction } from '@/server/self-healing/remediation-policy'

export type RemediationExecutionResult = {
  actionId: string
  actionType: RemediationAction['type']
  status: 'APPLIED' | 'SKIPPED'
  details: Record<string, unknown>
}

export async function applyRemediationAction(
  runId: string,
  action: RemediationAction,
  actorId?: string,
): Promise<RemediationExecutionResult> {
  const result: RemediationExecutionResult = {
    actionId: createId('action'),
    actionType: action.type,
    status: 'APPLIED',
    details: action.payload ?? {},
  }

  if (action.type === 'OPEN_INCIDENT') {
    const incidentId = createId('incident')
    store.incidents[incidentId] = {
      id: incidentId,
      status: 'OPEN',
      sourceRunId: runId,
      metadata: action.payload ?? {},
      createdAt: new Date().toISOString(),
    }
    result.details.incidentId = incidentId
  }

  if (action.type === 'CREATE_POSTMORTEM_DRAFT') {
    const postmortemId = createId('postmortem')
    store.postmortems[postmortemId] = {
      id: postmortemId,
      status: 'DRAFT',
      sourceRunId: runId,
      createdAt: new Date().toISOString(),
    }
    result.details.postmortemId = postmortemId
  }

  writeAuditEvent({
    category: 'self-healing',
    action: `action.${action.type.toLowerCase()}`,
    actorId,
    metadata: { runId, action },
  })

  return result
}
