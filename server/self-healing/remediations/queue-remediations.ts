import type { RemediationAction } from '@/server/self-healing/remediation-policy'

export function queueRemediations(sourceId?: string): RemediationAction[] {
  return [
    {
      type: 'REQUEUE_DEAD_LETTER_JOB',
      riskLevel: 'LOW',
      payload: { queueId: sourceId ?? 'default-queue', maxRetry: 3 },
    },
    {
      type: 'RESTART_WORKER_POOL',
      riskLevel: 'MEDIUM',
      payload: { reason: 'queue_backlog_health_trigger' },
    },
  ]
}
