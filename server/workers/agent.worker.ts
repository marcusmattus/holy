import { recordWorkerHeartbeat } from './shared/worker-health'
import { updateWorkerMetric } from './shared/worker-metrics'

export const agentWorkerConfig = {
  queue: 'agent',
  deadLetterQueue: 'agent:dlq',
  concurrency: 8,
  retryLimit: 4,
}

export async function runAgentWorker() {
  recordWorkerHeartbeat('agent-worker')
  return updateWorkerMetric({
    worker: 'agent-worker',
    queue: agentWorkerConfig.queue,
    processed: 0,
    failed: 0,
    retries: 0,
    deadLettered: 0,
    concurrency: agentWorkerConfig.concurrency,
  })
}
