import { recordWorkerHeartbeat } from './shared/worker-health'
import { updateWorkerMetric } from './shared/worker-metrics'

export const analyticsWorkerConfig = {
  queue: 'analytics',
  deadLetterQueue: 'analytics:dlq',
  concurrency: 6,
  retryLimit: 3,
}

export async function runAnalyticsWorker() {
  recordWorkerHeartbeat('analytics-worker')
  return updateWorkerMetric({
    worker: 'analytics-worker',
    queue: analyticsWorkerConfig.queue,
    processed: 0,
    failed: 0,
    retries: 0,
    deadLettered: 0,
    concurrency: analyticsWorkerConfig.concurrency,
  })
}
