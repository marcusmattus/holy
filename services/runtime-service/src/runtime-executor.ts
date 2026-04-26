import { runInSandbox } from './sandbox'
import { emitRuntimeLog, emitRuntimeMetric } from './telemetry'
import { DEFAULT_RUNTIME_POLICY, validateRuntimePolicy, type RuntimePolicy } from './policy'

export type RuntimeExecutionStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'

export interface RuntimeExecution {
  id: string
  status: RuntimeExecutionStatus
  createdAt: string
  updatedAt: string
  output?: string
  logs: string[]
  error?: string
}

export interface RuntimeExecutionRequest {
  code: string
  policy?: RuntimePolicy
}

const executionStore = new Map<string, RuntimeExecution>()

export async function executeRuntimeJob(request: RuntimeExecutionRequest): Promise<RuntimeExecution> {
  const id = crypto.randomUUID()
  const execution: RuntimeExecution = {
    id,
    status: 'running',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    logs: [],
  }
  executionStore.set(id, execution)

  try {
    const policy = validateRuntimePolicy(request.policy ?? DEFAULT_RUNTIME_POLICY)
    const sandboxResult = await runInSandbox({ executionId: id, code: request.code, policy })
    execution.status = sandboxResult.timedOut ? 'failed' : 'completed'
    execution.output = sandboxResult.output
    execution.logs = sandboxResult.logs
    execution.updatedAt = new Date().toISOString()
    emitRuntimeMetric({ name: 'runtime.execution.completed', value: 1, tags: { status: execution.status } })
    emitRuntimeLog('runtime.execution.completed', { executionId: id })
  } catch (error) {
    execution.status = 'failed'
    execution.error = error instanceof Error ? error.message : 'Unknown runtime error'
    execution.updatedAt = new Date().toISOString()
  }

  executionStore.set(id, execution)
  return execution
}

export function getRuntimeExecution(executionId: string): RuntimeExecution | null {
  return executionStore.get(executionId) ?? null
}

export function cancelRuntimeExecution(executionId: string): RuntimeExecution | null {
  const execution = executionStore.get(executionId)
  if (!execution || execution.status === 'completed' || execution.status === 'failed') {
    return execution ?? null
  }

  execution.status = 'cancelled'
  execution.updatedAt = new Date().toISOString()
  executionStore.set(executionId, execution)
  return execution
}
