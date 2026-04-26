import type { SuggestionImpact } from '@prisma/client'

const ACTION_RISK: Record<string, SuggestionImpact> = {
  READ_ANALYTICS: 'LOW',
  RUN_QA: 'LOW',
  PATCH_FILES: 'MEDIUM',
  UPDATE_PRICING: 'HIGH',
  DEPLOY_PRODUCTION: 'HIGH',
  PAYOUT: 'CRITICAL',
  SETTLEMENT: 'CRITICAL',
}

export function classifyActionRisk(action: string): SuggestionImpact {
  return ACTION_RISK[action] ?? 'MEDIUM'
}
