import { queueRemediations } from '@/server/self-healing/remediations/queue-remediations'
import { runtimeRemediations } from '@/server/self-healing/remediations/runtime-remediations'
import { workerRemediations } from '@/server/self-healing/remediations/worker-remediations'
import type { RemediationAction } from '@/server/self-healing/remediation-policy'

export type SelfHealingTriggerType =
  | 'ALERT'
  | 'INCIDENT'
  | 'SCHEDULED_CHECK'
  | 'MANUAL'
  | 'WORKFLOW_FAILURE'
  | 'RUNTIME_FAILURE'
  | 'SETTLEMENT_FAILURE'
  | 'SEARCH_INDEX_FAILURE'

export type DiagnosisResult = {
  summary: string
  confidence: number
  category: string
  recommendedActions: RemediationAction[]
}

export function diagnoseSelfHealingTrigger(input: {
  triggerType: SelfHealingTriggerType
  sourceType?: string
  sourceId?: string
}): DiagnosisResult {
  const base = {
    confidence: 0.78,
    category: input.triggerType,
  }

  if (input.triggerType === 'RUNTIME_FAILURE') {
    return {
      ...base,
      summary: 'Runtime instability detected with elevated error rate.',
      recommendedActions: runtimeRemediations(input.sourceId),
    }
  }

  if (input.triggerType === 'WORKFLOW_FAILURE') {
    return {
      ...base,
      summary: 'Worker workflow failures crossed threshold.',
      recommendedActions: workerRemediations(input.sourceId),
    }
  }

  if (input.triggerType === 'SEARCH_INDEX_FAILURE') {
    return {
      ...base,
      summary: 'Search index freshness degraded.',
      recommendedActions: [
        {
          type: 'REINDEX_MARKETPLACE_ASSET',
          riskLevel: 'LOW',
          payload: { assetId: input.sourceId },
        },
      ],
    }
  }

  if (input.triggerType === 'SETTLEMENT_FAILURE') {
    return {
      ...base,
      summary: 'Settlement provider has elevated failure rates.',
      recommendedActions: [
        {
          type: 'DISABLE_SETTLEMENT_PROVIDER',
          riskLevel: 'HIGH',
          destructive: true,
          payload: { providerId: input.sourceId ?? 'default-provider' },
        },
        {
          type: 'OPEN_INCIDENT',
          riskLevel: 'LOW',
          payload: { reason: 'settlement_failure' },
        },
      ],
    }
  }

  return {
    ...base,
    summary: 'General alert detected; queue and worker balancing suggested.',
    recommendedActions: [...queueRemediations(input.sourceId), ...workerRemediations(input.sourceId)],
  }
}
