import { executeWorkflowSteps } from '@/server/workflows/engine/workflow-executor'
import {
  DEFAULT_RETRY_POLICY,
  isTransientWorkflowError,
  TransientWorkflowError,
} from '@/server/workflows/engine/retry-policy'
import { auditLog } from '@/server/observability/logger'

export type WorkflowJob = {
  runId: string
  workflowId: string
  steps: Array<{ id: string; type: 'task' | 'approval'; action: string }>
  timeoutMs?: number
}

const workflowRuns = new Map<string, { status: string; outputs: unknown[] }>()

export async function processWorkflowJob(job: WorkflowJob) {
  let attempt = 0
  while (attempt < DEFAULT_RETRY_POLICY.maxAttempts) {
    attempt += 1
    try {
      const timeoutMs = job.timeoutMs ?? 10_000
      let timeoutId: NodeJS.Timeout | undefined
      const timer = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new TransientWorkflowError('workflow timeout')), timeoutMs)
      })
      const run = (await Promise.race([executeWorkflowSteps(job.steps), timer])) as Awaited<
        ReturnType<typeof executeWorkflowSteps>
      >
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      workflowRuns.set(job.runId, { status: run.status, outputs: run.outputs })
      auditLog({
        action: 'workflow.run',
        actor: 'system',
        resource: job.workflowId,
        metadata: { runId: job.runId, status: run.status, attempt },
      })
      return workflowRuns.get(job.runId)
    } catch (error) {
      if (!isTransientWorkflowError(error)) {
      workflowRuns.set(job.runId, {
        status: 'FAILED',
        outputs: [{ error: error instanceof Error ? error.message : 'unknown error' }],
      })
      return workflowRuns.get(job.runId)
    }

      if (attempt >= DEFAULT_RETRY_POLICY.maxAttempts) {
        workflowRuns.set(job.runId, {
          status: 'FAILED',
          outputs: [{ error: error instanceof Error ? error.message : 'unknown error' }],
        })
        return workflowRuns.get(job.runId)
      }

      await new Promise((resolve) =>
        setTimeout(resolve, DEFAULT_RETRY_POLICY.backoffMs * 2 ** (attempt - 1))
      )
    }
  }

  return workflowRuns.get(job.runId)
}

export function cancelWorkflowRun(runId: string) {
  workflowRuns.set(runId, { status: 'CANCELLED', outputs: [] })
  return workflowRuns.get(runId)
}
