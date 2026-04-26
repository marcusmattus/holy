import { processWorkflowJob, type WorkflowJob } from '@/server/workflows/engine/workflow-engine'
import { getRedisConfig } from '@/server/queues/redis'

const pending: WorkflowJob[] = []

export async function enqueueWorkflow(job: WorkflowJob) {
  pending.push(job)
  const config = getRedisConfig()
  if (config.mode === 'memory') {
    try {
      return await processWorkflowJob(job)
    } finally {
      const index = pending.findIndex((queued) => queued.runId === job.runId)
      if (index >= 0) {
        pending.splice(index, 1)
      }
    }
  }

  return { queued: true, backend: 'redis' }
}

export function getWorkflowQueueDepth() {
  return pending.length
}
