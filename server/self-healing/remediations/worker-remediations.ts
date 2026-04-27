import type { RemediationAction } from '@/server/self-healing/remediation-policy'

export function workerRemediations(sourceId?: string): RemediationAction[] {
  return [
    {
      type: 'RESTART_WORKER_POOL',
      riskLevel: 'MEDIUM',
      payload: { workerPoolId: sourceId ?? 'default-worker-pool' },
    },
    {
      type: 'RETRY_FAILED_JOB',
      riskLevel: 'LOW',
      payload: { retryLimit: 3 },
    },
  ]
}
