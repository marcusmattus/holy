import {
  ComplianceReviewStatus,
  ComplianceRiskLevel,
  ComplianceTargetType,
  type Prisma,
  PriceType,
} from '@prisma/client'
import { prisma } from '@/server/services/prisma'

type DecisionStatus = 'APPROVED' | 'REJECTED' | 'NEEDS_CHANGES'

export async function queueComplianceReview(input: {
  targetType: ComplianceTargetType
  targetId: string
  checks?: Record<string, unknown>
  riskLevel?: ComplianceRiskLevel
  notes?: string
}) {
  return prisma.complianceReview.create({
    data: {
      targetType: input.targetType,
      targetId: input.targetId,
      checks: input.checks as Prisma.InputJsonValue | undefined,
      riskLevel: input.riskLevel ?? ComplianceRiskLevel.MEDIUM,
      notes: input.notes,
    },
  })
}

export async function ensurePaidAgentListingCompliance(agentListingId: string) {
  const listing = await prisma.agentListing.findUnique({
    where: { id: agentListingId },
    select: { id: true, priceType: true, status: true },
  })
  if (!listing) throw new Error('Agent listing not found')

  if (listing.priceType === PriceType.FREE) return true

  const approvedReview = await prisma.complianceReview.findFirst({
    where: {
      targetType: ComplianceTargetType.AGENT_LISTING,
      targetId: agentListingId,
      status: ComplianceReviewStatus.APPROVED,
    },
  })

  return Boolean(approvedReview)
}

export async function listComplianceQueue() {
  return prisma.complianceReview.findMany({
    where: { status: ComplianceReviewStatus.PENDING },
    orderBy: [{ riskLevel: 'desc' }, { createdAt: 'asc' }],
  })
}

export async function decideComplianceReview(input: {
  reviewId: string
  status: DecisionStatus
  reviewedById?: string
  notes?: string
}) {
  if (input.status === 'REJECTED' && !input.notes?.trim()) {
    throw new Error('Admin notes are required for rejection')
  }

  const review = await prisma.complianceReview.update({
    where: { id: input.reviewId },
    data: {
      status: input.status,
      reviewedById: input.reviewedById,
      notes: input.notes,
    },
  })

  return review
}
