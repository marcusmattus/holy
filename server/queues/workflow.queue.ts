import { processWorkflowJob, type WorkflowJob } from '@/server/workflows/engine/workflow-engine'
import { getRedisConfig } from '@/server/queues/redis'

const pending: WorkflowJob[] = []

export async function enqueueWorkflow(job: WorkflowJob) {
  pending.push(job)
  const config = getRedisConfig()
  if (config.mode === 'memory') {
    return processWorkflowJob(job)
  }

  return { queued: true, backend: 'redis' }
}

export function getWorkflowQueueDepth() {
  return pending.length
}
