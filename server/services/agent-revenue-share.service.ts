import { prisma } from '@/server/db'

export type RevenueSplitInput = {
  type: 'CREATOR' | 'WORKFLOW_CREATOR' | 'REFERRER' | 'PLATFORM' | 'RESELLER'
  beneficiaryId?: string
  bps: number
}

export async function createRevenueLedgerEntries(input: {
  agentListingId: string
  sourceType: 'SUBSCRIPTION' | 'USAGE_CHARGE'
  sourceId: string
  grossAmountCents: number
  splits: RevenueSplitInput[]
}) {
  const totalBps = input.splits.reduce((sum, split) => sum + split.bps, 0)
  if (totalBps > 10_000) {
    throw new Error('Revenue split basis points cannot exceed 10000')
  }

  const entries = input.splits.map((split) => {
    const amountCents = Math.floor((input.grossAmountCents * split.bps) / 10_000)
    return {
      agentListingId: input.agentListingId,
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      beneficiaryType: split.type,
      beneficiaryId: split.beneficiaryId,
      amountCents,
      bps: split.bps,
      metadata: {
        platformFeeVisible: true,
      },
    }
  })

  return prisma.revenueLedgerEntry.createMany({
    data: entries,
  })
}
