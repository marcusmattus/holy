import { classifyActionRisk } from '@/server/agents/policies/risk-classifier'
import { requiresApproval } from '@/server/agents/policies/approval-policy'

const BLOCKED_DIRECT_ACTIONS = new Set([
  'DEPLOY_PRODUCTION',
  'PAYOUT',
  'SETTLEMENT',
  'PAYMENT_API_CALL',
])

export type ActionPolicyInput = {
  action: string
  allowedActions: string[]
  isAdminApproved?: boolean
}

export function evaluateActionPolicy(input: ActionPolicyInput) {
  const riskLevel = classifyActionRisk(input.action)

  if (!input.allowedActions.includes(input.action)) {
    return {
      allowed: false,
      riskLevel,
      requiresApproval: true,
      reason: 'Action is not in agent allowlist',
    }
  }

  if (BLOCKED_DIRECT_ACTIONS.has(input.action)) {
    return {
      allowed: false,
      riskLevel,
      requiresApproval: true,
      reason: 'Critical actions must pass workflow safety and admin approval gates',
    }
  }

  return {
    allowed: true,
    riskLevel,
    requiresApproval: requiresApproval(riskLevel, Boolean(input.isAdminApproved)),
    reason: 'Action allowed by policy',
  }
}
