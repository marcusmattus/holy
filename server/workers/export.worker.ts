import { recordWorkerHeartbeat } from './shared/worker-health'
import { updateWorkerMetric } from './shared/worker-metrics'

export const exportWorkerConfig = {
  queue: 'exports',
  deadLetterQueue: 'exports:dlq',
  concurrency: 3,
  retryLimit: 3,
}

export async function runExportWorker() {
  recordWorkerHeartbeat('export-worker')
  return updateWorkerMetric({
    worker: 'export-worker',
    queue: exportWorkerConfig.queue,
    processed: 0,
    failed: 0,
    retries: 0,
    deadLettered: 0,
    concurrency: exportWorkerConfig.concurrency,
  })
}
