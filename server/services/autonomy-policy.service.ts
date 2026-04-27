export interface AutonomyPolicyRecord {
  workspaceId: string
  scope: 'WORKSPACE' | 'PROJECT' | 'AGENT' | 'WORKFLOW'
  maxRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  autoApplyAllowed: boolean
  requiresApprovalFor: string[]
  disabledActions: string[]
}

export function getAutonomyPolicy(workspaceId: string): AutonomyPolicyRecord {
  return {
    workspaceId,
    scope: 'WORKSPACE',
    maxRisk: 'LOW',
    autoApplyAllowed: false,
    requiresApprovalFor: ['production_deploy', 'pricing_change', 'payout', 'settlement'],
    disabledActions: [],
  }
}

export function updateAutonomyPolicy(workspaceId: string, updates: Partial<AutonomyPolicyRecord>) {
  return {
    ...getAutonomyPolicy(workspaceId),
    ...updates,
    workspaceId,
  }
}
