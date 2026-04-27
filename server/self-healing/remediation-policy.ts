export type RemediationRisk = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type RemediationActionType =
  | 'RETRY_FAILED_JOB'
  | 'DRAIN_RUNTIME_NODE'
  | 'RESTART_WORKER_POOL'
  | 'REQUEUE_DEAD_LETTER_JOB'
  | 'REINDEX_MARKETPLACE_ASSET'
  | 'ROLLBACK_DEPLOYMENT'
  | 'PAUSE_AUTONOMY_POLICY'
  | 'DISABLE_SETTLEMENT_PROVIDER'
  | 'OPEN_INCIDENT'
  | 'CREATE_POSTMORTEM_DRAFT'

export type RemediationAction = {
  type: RemediationActionType
  riskLevel: RemediationRisk
  destructive?: boolean
  payload?: Record<string, unknown>
}

export type SelfHealingPolicy = {
  allowAutoApplyLowRisk: boolean
  allowAutoApplyMediumRisk: boolean
}

export const defaultSelfHealingPolicy: SelfHealingPolicy = {
  allowAutoApplyLowRisk: true,
  allowAutoApplyMediumRisk: false,
}

export function actionRequiresApproval(
  action: RemediationAction,
  policy: SelfHealingPolicy = defaultSelfHealingPolicy,
) {
  if (action.destructive) return true
  if (action.riskLevel === 'HIGH' || action.riskLevel === 'CRITICAL') return true
  if (action.riskLevel === 'MEDIUM') return !policy.allowAutoApplyMediumRisk
  return !policy.allowAutoApplyLowRisk
}
