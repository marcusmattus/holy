import type { SuggestionImpact } from '@prisma/client'

export function requiresApproval(
  riskLevel: SuggestionImpact,
  isAdminApproved: boolean,
): boolean {
  switch (riskLevel) {
    case 'LOW':
      return false
    case 'MEDIUM':
    case 'HIGH':
      return true
    case 'CRITICAL':
      return !isAdminApproved
  }
}
