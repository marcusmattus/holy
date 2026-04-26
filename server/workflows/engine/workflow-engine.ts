import { executeWorkflowSteps } from '@/server/workflows/engine/workflow-executor'
import { DEFAULT_RETRY_POLICY } from '@/server/workflows/engine/retry-policy'
import { auditLog } from '@/server/observability/logger'

export type WorkflowJob = {
  runId: string
  workflowId: string
  steps: Array<{ id: string; type: 'task' | 'approval'; action: string }>
  timeoutMs?: number
}

const workflowRuns = new Map<string, { status: string; outputs: unknown[] }>()

export async function processWorkflowJob(job: WorkflowJob) {
  const timeoutMs = job.timeoutMs ?? 10_000
  const timer = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('workflow timeout')), timeoutMs)
  })

  let attempt = 0
  while (attempt < DEFAULT_RETRY_POLICY.maxAttempts) {
    attempt += 1
    try {
      const run = (await Promise.race([
        executeWorkflowSteps(job.steps),
        timer,
      ])) as Awaited<ReturnType<typeof executeWorkflowSteps>>

      workflowRuns.set(job.runId, { status: run.status, outputs: run.outputs })
      auditLog({
        action: 'workflow.run',
        actor: 'system',
        resource: job.workflowId,
        metadata: { runId: job.runId, status: run.status, attempt },
      })
      return workflowRuns.get(job.runId)
    } catch (error) {
      if (attempt >= DEFAULT_RETRY_POLICY.maxAttempts) {
        workflowRuns.set(job.runId, {
          status: 'FAILED',
          outputs: [error instanceof Error ? error.message : 'unknown error'],
        })
      }
    }
  }

  return workflowRuns.get(job.runId)
}

export function cancelWorkflowRun(runId: string) {
  workflowRuns.set(runId, { status: 'CANCELLED', outputs: [] })
  return workflowRuns.get(runId)
}
