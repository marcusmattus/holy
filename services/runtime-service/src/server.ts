import { cancelRuntimeExecution, executeRuntimeJob, getRuntimeExecution } from './runtime-executor'

export async function handleRuntimeExecute(body: { code?: string }) {
  if (!body.code) {
    return { status: 400, body: { error: 'code is required' } }
  }

  const execution = await executeRuntimeJob({ code: body.code })
  return { status: 200, body: execution }
}

export function handleRuntimeExecutionGet(id: string) {
  const execution = getRuntimeExecution(id)
  if (!execution) {
    return { status: 404, body: { error: 'execution not found' } }
  }

  return { status: 200, body: execution }
}

export function handleRuntimeExecutionCancel(id: string) {
  const existing = getRuntimeExecution(id)
  if (!existing) {
    return { status: 404, body: { error: 'execution not found' } }
  }

  const execution = cancelRuntimeExecution(id)
  if (!execution) {
    return { status: 409, body: { error: 'execution can no longer be cancelled' } }
  }

  return { status: 200, body: execution }
}
