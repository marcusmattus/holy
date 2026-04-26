import { executeSettlementBatch } from '@/server/protocol/settlement-executor'

const queue: Array<{
  batchId: string
  provider: string
  amountCents: number
  approved: boolean
  creatorOptIn: boolean
}> = []

export function enqueueSettlementBatch(job: {
  batchId: string
  provider: string
  amountCents: number
  approved: boolean
  creatorOptIn: boolean
}) {
  queue.push(job)
}

export async function runSettlementWorker() {
  const next = queue.shift()
  if (!next) {
    return { status: 'idle' as const }
  }

  return executeSettlementBatch({
    ...next,
    dryRun: false,
  })
}
