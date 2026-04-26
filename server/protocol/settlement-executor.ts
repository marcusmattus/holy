import { prisma } from '@/server/db'
import { isSettlementEmergencyStopped } from '@/server/protocol/settlement-emergency-stop'
import { assertSettlementLimits } from '@/server/protocol/settlement-limits'

const processedBatches = new Set<string>()
const dryRunApprovedBatches = new Set<string>()

export async function executeSettlementBatch(input: {
  batchId: string
  provider: string
  amountCents: number
  approved: boolean
  creatorOptIn: boolean
  dryRun?: boolean
}) {
  if (isSettlementEmergencyStopped()) {
    throw new Error('Settlement emergency stop is active')
  }

  assertSettlementLimits(input)

  if (processedBatches.has(input.batchId)) {
    return { batchId: input.batchId, status: 'already-processed', txHash: null }
  }

  if (input.dryRun ?? true) {
    dryRunApprovedBatches.add(input.batchId)
    return { batchId: input.batchId, status: 'dry-run-ok', txHash: null }
  }

  if (!dryRunApprovedBatches.has(input.batchId)) {
    throw new Error('Dry run must complete before execution')
  }

  const txHash = `tx_${input.batchId}_${Date.now()}`
  processedBatches.add(input.batchId)

  await prisma.auditLog.create({
    data: {
      actorType: 'settlement-worker',
      action: 'settlement.executed',
      resourceId: input.batchId,
      metadata: {
        txHash,
        amountCents: input.amountCents,
        provider: input.provider,
      },
    },
  })

  return { batchId: input.batchId, status: 'executed', txHash }
}
