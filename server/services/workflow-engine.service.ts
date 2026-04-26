import { enqueueWorkflow } from '@/server/queues/workflow.queue'
import { cancelWorkflowRun } from '@/server/workflows/engine/workflow-engine'
import { reserveIdempotencyKey, completeIdempotencyKey } from '@/server/workflows/engine/idempotency'
import { auditLog } from '@/server/observability/logger'

export async function enqueueWorkflowRun(params: {
  workflowId: string
  runId: string
  idempotencyKey: string
  actor: string
  steps: Array<{ id: string; type: 'task' | 'approval'; action: string }>
}) {
  const idempotency = await reserveIdempotencyKey(
    params.idempotencyKey,
    `workflow:${params.workflowId}`
  )
  if (idempotency.isDuplicate) {
    return { duplicate: true, response: idempotency.response }
  }

  const run = await enqueueWorkflow({
    workflowId: params.workflowId,
    runId: params.runId,
    steps: params.steps,
  })

  await completeIdempotencyKey(params.idempotencyKey, run)
  auditLog({
    action: 'workflow.enqueue',
    actor: params.actor,
    resource: params.workflowId,
    metadata: { runId: params.runId },
  })

  return run
}

export function cancelWorkflow(runId: string, actor: string) {
  const result = cancelWorkflowRun(runId)
  auditLog({ action: 'workflow.cancel', actor, resource: runId })
  return result
}
