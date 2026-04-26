import { canExecute, completeExecution, startExecution, type RuntimeExecutionPolicy } from './policy'
import { createTenantScopedContext, type RuntimeContext } from './sandbox'
import { emitMetric, structuredLog } from './telemetry'

export async function executeRuntimeJob(
  context: RuntimeContext,
  policy: RuntimeExecutionPolicy,
  executor: (scopedContext: RuntimeContext) => Promise<unknown>,
) {
  if (!canExecute(policy)) {
    throw new Error('Workspace execution limit reached')
  }

  startExecution(policy.workspaceId)
  const scopedContext = createTenantScopedContext(context, policy)

  const startedAt = Date.now()
  structuredLog('runtime.execution.start', {
    workspaceId: scopedContext.workspaceId,
    jobId: scopedContext.jobId,
  })

  try {
    const result = await Promise.race([
      executor(scopedContext),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Execution timeout exceeded')), policy.timeoutMs)),
    ])

    emitMetric({
      name: 'runtime_execution_duration_ms',
      value: Date.now() - startedAt,
      labels: { workspace: scopedContext.workspaceId },
    })

    structuredLog('runtime.execution.success', {
      workspaceId: scopedContext.workspaceId,
      jobId: scopedContext.jobId,
    })

    return result
  } catch (error) {
    emitMetric({ name: 'runtime_execution_failure_total', value: 1, labels: { workspace: scopedContext.workspaceId } })
    structuredLog('runtime.execution.failure', {
      workspaceId: scopedContext.workspaceId,
      jobId: scopedContext.jobId,
      error: error instanceof Error ? error.message : 'unknown-error',
    })
    throw error
  } finally {
    completeExecution(policy.workspaceId)
  }
}
