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
type RuntimeExecutionStore = {
  get(executionId: string): RuntimeExecution | null
  set(execution: RuntimeExecution): void
}

let externalExecutionStore: RuntimeExecutionStore | null = null

export function configureRuntimeExecutionStore(store: RuntimeExecutionStore) {
  externalExecutionStore = store
}

function getExecutionFromStore(executionId: string) {
  return externalExecutionStore?.get(executionId) ?? executionStore.get(executionId) ?? null
}

function setExecutionInStore(execution: RuntimeExecution) {
  executionStore.set(execution.id, execution)
  externalExecutionStore?.set(execution)
}

export async function executeRuntimeJob(request: RuntimeExecutionRequest): Promise<RuntimeExecution> {
  const id = crypto.randomUUID()
  const execution: RuntimeExecution = {
    id,
    status: 'running',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    logs: [],
  }
  setExecutionInStore(execution)

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

  setExecutionInStore(execution)
  return execution
}

export function getRuntimeExecution(executionId: string): RuntimeExecution | null {
  return getExecutionFromStore(executionId)
}

export function cancelRuntimeExecution(executionId: string): RuntimeExecution | null {
  const execution = getExecutionFromStore(executionId)
  if (!execution) {
    return null
  }
  if (execution.status === 'completed' || execution.status === 'failed') {
    return null
  }

  execution.status = 'cancelled'
  execution.updatedAt = new Date().toISOString()
  setExecutionInStore(execution)
  return execution
}
