import { createId, store, writeAuditEvent } from '@/server/core/in-memory-store'
import { diagnoseSelfHealingTrigger, type SelfHealingTriggerType } from '@/server/self-healing/diagnostics'
import { actionRequiresApproval, type RemediationAction, type SelfHealingPolicy, defaultSelfHealingPolicy } from '@/server/self-healing/remediation-policy'
import { applyRemediationAction } from '@/server/self-healing/remediation-registry'

export type SelfHealingRunRecord = {
  id: string
  triggerType: SelfHealingTriggerType
  sourceType?: string
  sourceId?: string
  status: 'PENDING' | 'DIAGNOSING' | 'PROPOSED' | 'APPROVED' | 'APPLIED' | 'FAILED' | 'DISMISSED'
  diagnosis?: Record<string, unknown>
  proposedActions?: RemediationAction[]
  appliedActions?: unknown[]
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  error?: string
  approvedById?: string
  createdAt: string
  updatedAt: string
}

function deriveRisk(actions: RemediationAction[]): SelfHealingRunRecord['riskLevel'] {
  if (actions.some((action) => action.riskLevel === 'CRITICAL')) return 'CRITICAL'
  if (actions.some((action) => action.riskLevel === 'HIGH')) return 'HIGH'
  if (actions.some((action) => action.riskLevel === 'MEDIUM')) return 'MEDIUM'
  return 'LOW'
}

export async function createSelfHealingRun(input: {
  triggerType: SelfHealingTriggerType
  sourceType?: string
  sourceId?: string
  policy?: SelfHealingPolicy
}) {
  const now = new Date().toISOString()
  const runId = createId('shr')
  const run: SelfHealingRunRecord = {
    id: runId,
    triggerType: input.triggerType,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    status: 'DIAGNOSING',
    createdAt: now,
    updatedAt: now,
    riskLevel: 'MEDIUM',
  }

  store.selfHealingRuns[runId] = run

  const diagnosis = diagnoseSelfHealingTrigger(input)
  const proposedActions = diagnosis.recommendedActions
  const riskLevel = deriveRisk(proposedActions)
  const policy = input.policy ?? defaultSelfHealingPolicy

  run.diagnosis = diagnosis as unknown as Record<string, unknown>
  run.proposedActions = proposedActions
  run.riskLevel = riskLevel
  run.status = 'PROPOSED'
  run.updatedAt = new Date().toISOString()

  const autoApplicable = proposedActions.filter((action) => !actionRequiresApproval(action, policy))

  if (autoApplicable.length > 0) {
    const applied = await Promise.all(autoApplicable.map((action) => applyRemediationAction(runId, action)))
    run.appliedActions = applied
    run.status = 'APPLIED'
    run.updatedAt = new Date().toISOString()
  }

  writeAuditEvent({
    category: 'self-healing',
    action: 'run.created',
    metadata: { runId, triggerType: input.triggerType, sourceType: input.sourceType, sourceId: input.sourceId },
  })

  return run
}

export async function approveSelfHealingRun(runId: string, approverId: string) {
  const run = store.selfHealingRuns[runId] as SelfHealingRunRecord | undefined
  if (!run) {
    throw new Error('Run not found')
  }

  const pendingActions = (run.proposedActions ?? []).filter((action) => {
    return !(run.appliedActions ?? []).some((applied) => {
      const record = applied as { actionType?: string }
      return record.actionType === action.type
    })
  })

  const applied = await Promise.all(
    pendingActions.map((action) => applyRemediationAction(runId, action, approverId)),
  )

  run.approvedById = approverId
  run.status = 'APPLIED'
  run.appliedActions = [...(run.appliedActions ?? []), ...applied]
  run.updatedAt = new Date().toISOString()

  writeAuditEvent({
    category: 'self-healing',
    action: 'run.approved',
    actorId: approverId,
    metadata: { runId },
  })

  return run
}

export function listSelfHealingRuns() {
  return Object.values(store.selfHealingRuns) as SelfHealingRunRecord[]
}
