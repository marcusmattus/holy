import { recordWorkerHeartbeat } from './shared/worker-health'
import { updateWorkerMetric } from './shared/worker-metrics'

export const workflowWorkerConfig = {
  queue: 'workflow',
  deadLetterQueue: 'workflow:dlq',
  concurrency: 10,
  retryLimit: 5,
}

export async function runWorkflowWorker() {
  recordWorkerHeartbeat('workflow-worker')
  return updateWorkerMetric({
    worker: 'workflow-worker',
    queue: workflowWorkerConfig.queue,
    processed: 0,
    failed: 0,
    retries: 0,
    deadLettered: 0,
    concurrency: workflowWorkerConfig.concurrency,
  })
}
