export type AutonomyRisk = 'low' | 'medium' | 'high'

export interface AutonomyAction {
  action: string
  risk: AutonomyRisk
  autoAllowed: boolean
}

export const AUTONOMY_ACTION_REGISTRY: AutonomyAction[] = [
  { action: 'run-qa', risk: 'low', autoAllowed: true },
  { action: 'collect-analytics', risk: 'low', autoAllowed: true },
  { action: 'generate-suggestions', risk: 'low', autoAllowed: true },
  { action: 'refresh-semantic-index', risk: 'low', autoAllowed: true },
  { action: 'create-draft-listing-copy', risk: 'low', autoAllowed: true },
  { action: 'create-preview-deployment', risk: 'medium', autoAllowed: false },
  { action: 'production-deploy', risk: 'high', autoAllowed: false },
  { action: 'pricing-change', risk: 'high', autoAllowed: false },
  { action: 'payout', risk: 'high', autoAllowed: false },
  { action: 'settlement', risk: 'high', autoAllowed: false },
  { action: 'delete-project', risk: 'high', autoAllowed: false },
  { action: 'publish-paid-asset', risk: 'high', autoAllowed: false },
]
