import { recordWorkerHeartbeat } from './shared/worker-health'
import { updateWorkerMetric } from './shared/worker-metrics'

export const runtimeWorkerConfig = {
  queue: 'runtime',
  deadLetterQueue: 'runtime:dlq',
  concurrency: 5,
  retryLimit: 3,
}

export async function runRuntimeWorker() {
  recordWorkerHeartbeat('runtime-worker')
  return updateWorkerMetric({
    worker: 'runtime-worker',
    queue: runtimeWorkerConfig.queue,
    processed: 0,
    failed: 0,
    retries: 0,
    deadLettered: 0,
    concurrency: runtimeWorkerConfig.concurrency,
  })
}
