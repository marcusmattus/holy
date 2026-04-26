import { createDefaultSettlementPolicy } from '@/server/protocol/settlement-rollout'

const rolloutPolicies = new Map<string, ReturnType<typeof createDefaultSettlementPolicy>>()

export function getSettlementRolloutPolicy(workspaceId: string) {
  if (!rolloutPolicies.has(workspaceId)) {
    rolloutPolicies.set(workspaceId, createDefaultSettlementPolicy(workspaceId))
  }
  return rolloutPolicies.get(workspaceId)
}

export function emergencyDisableSettlement(workspaceId: string) {
  const policy = getSettlementRolloutPolicy(workspaceId)
  if (!policy) {
    return null
  }
  policy.enabled = false
  policy.emergencyDisabled = true
  rolloutPolicies.set(workspaceId, policy)
  return policy
}
