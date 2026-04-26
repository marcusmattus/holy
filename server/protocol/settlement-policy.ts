import { ComplianceReviewStatus, ComplianceTargetType } from '@prisma/client'
import { prisma } from '@/server/services/prisma'

export const SETTLEMENT_MAX_BATCH_CENTS = 100_000

export async function canRunSettlementPilot(input: {
  providerId: string
  adminApproved: boolean
  creatorOptIn: boolean
}) {
  if (!input.adminApproved) return { allowed: false, reason: 'Admin approval required' }
  if (!input.creatorOptIn) return { allowed: false, reason: 'Creator opt-in required' }

  const review = await prisma.complianceReview.findFirst({
    where: {
      targetType: ComplianceTargetType.SETTLEMENT_PROVIDER,
      targetId: input.providerId,
      status: ComplianceReviewStatus.APPROVED,
    },
  })
  if (!review) {
    return { allowed: false, reason: 'Compliance-approved provider required' }
  }

  return { allowed: true as const }
}
