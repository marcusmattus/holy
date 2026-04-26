export type CampaignActionRisk = 'LOW' | 'MEDIUM' | 'HIGH'

export type CampaignAction = {
  id: string
  type: 'COPY_UPDATE' | 'DESIGN_UPDATE' | 'CODE_PATCH' | 'PUBLISH' | 'DEPLOY' | 'PRICING_CHANGE'
  riskLevel: CampaignActionRisk
  payload?: Record<string, unknown>
}

export type CampaignPolicy = {
  allowAutoDraftActions: boolean
  requireApprovalForPublish: boolean
}

export const defaultCampaignPolicy: CampaignPolicy = {
  allowAutoDraftActions: true,
  requireApprovalForPublish: true,
}

export function requiresCampaignApproval(action: CampaignAction, policy: CampaignPolicy) {
  if (action.type === 'PUBLISH' || action.type === 'DEPLOY' || action.type === 'PRICING_CHANGE') {
    return policy.requireApprovalForPublish
  }
  return action.riskLevel !== 'LOW' || !policy.allowAutoDraftActions
}
