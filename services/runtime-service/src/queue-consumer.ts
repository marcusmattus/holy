import { executeRuntimeJob } from './runtime-executor'
import type { RuntimeExecutionPolicy } from './policy'
import { structuredLog } from './telemetry'

export interface QueueJob {
  id: string
  workspaceId: string
  tenantId: string
  payload: Record<string, unknown>
}

export async function consumeQueue(
  jobs: QueueJob[],
  policyByWorkspace: (workspaceId: string, tenantId: string) => RuntimeExecutionPolicy,
) {
  for (const job of jobs) {
    const policy = policyByWorkspace(job.workspaceId, job.tenantId)
    await executeRuntimeJob(
      {
        workspaceId: job.workspaceId,
        tenantId: job.tenantId,
        jobId: job.id,
        payload: job.payload,
      },
      policy,
      async () => ({ processed: true }),
    )

    structuredLog('runtime.queue.ack', { jobId: job.id, workspaceId: job.workspaceId })
  }
}
