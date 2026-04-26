import { recordWorkerHeartbeat } from './shared/worker-health'
import { updateWorkerMetric } from './shared/worker-metrics'

export const settlementWorkerConfig = {
  queue: 'settlement',
  deadLetterQueue: 'settlement:dlq',
  concurrency: 2,
  retryLimit: 2,
}

export async function runSettlementWorker() {
  recordWorkerHeartbeat('settlement-worker')
  return updateWorkerMetric({
    worker: 'settlement-worker',
    queue: settlementWorkerConfig.queue,
    processed: 0,
    failed: 0,
    retries: 0,
    deadLettered: 0,
    concurrency: settlementWorkerConfig.concurrency,
  })
}
