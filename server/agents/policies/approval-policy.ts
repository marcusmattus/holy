import type { SuggestionImpact } from '@prisma/client'

export function requiresApproval(
  riskLevel: SuggestionImpact,
  isAdminApproved: boolean,
): boolean {
  if (riskLevel === 'LOW') return false
  if (riskLevel === 'CRITICAL') return !isAdminApproved
  return true
}
