export interface SettlementRolloutPolicy {
  workspaceId: string
  enabled: boolean
  dryRun: boolean
  maxDailyAmountCents: number
  approvedProvider: string
  emergencyDisabled: boolean
}

export function createDefaultSettlementPolicy(workspaceId: string): SettlementRolloutPolicy {
  return {
    workspaceId,
    enabled: false,
    dryRun: true,
    maxDailyAmountCents: 0,
    approvedProvider: 'none',
    emergencyDisabled: false,
  }
}
