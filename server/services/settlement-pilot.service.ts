import { PrismaClient, ComplianceReviewStatus, SettlementBatchStatus } from '@prisma/client'
import { auditLog } from '@/server/observability/logger'

const prisma = new PrismaClient()

function isSettlementPilotEnabled() {
  return process.env.HOLY_SETTLEMENT_PILOT_ENABLED === 'true'
}

export async function previewSettlementBatch(params: {
  provider: string
  currency: string
  totalAmount: number
  items: unknown
  actor: string
}) {
  if (!isSettlementPilotEnabled()) {
    throw new Error('Settlement pilot disabled')
  }

  const approval = await prisma.settlementProviderApproval.findFirst({
    where: {
      provider: params.provider,
      currency: params.currency,
      status: ComplianceReviewStatus.APPROVED,
    },
  })

  if (!approval) {
    throw new Error('Provider is not approved for settlement pilot')
  }

  if (approval.maxBatchAmount && params.totalAmount > approval.maxBatchAmount) {
    throw new Error('Batch amount exceeds approved maximum')
  }

  const batch = await prisma.settlementBatch.create({
    data: {
      provider: params.provider,
      currency: params.currency,
      totalAmount: params.totalAmount,
      items: params.items as object,
      preview: { approvedProviderId: approval.id },
      status: SettlementBatchStatus.PREVIEWED,
    },
  })

  auditLog({ action: 'settlement.preview', actor: params.actor, resource: batch.id })
  return batch
}
