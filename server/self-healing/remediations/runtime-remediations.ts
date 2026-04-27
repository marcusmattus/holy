import type { RemediationAction } from '@/server/self-healing/remediation-policy'

export function runtimeRemediations(sourceId?: string): RemediationAction[] {
  return [
    {
      type: 'DRAIN_RUNTIME_NODE',
      riskLevel: 'MEDIUM',
      payload: { nodeId: sourceId ?? 'runtime-node-unknown', targetState: 'DRAINING' },
    },
    {
      type: 'OPEN_INCIDENT',
      riskLevel: 'LOW',
      payload: { reason: 'runtime_failure_rate_exceeded' },
    },
  ]
}
