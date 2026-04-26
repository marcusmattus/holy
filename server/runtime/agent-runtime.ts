import type { RuntimePolicy } from '@/server/runtime/runtime-policy'

export type RuntimeExecutionInput = {
  script: string
  payload?: Record<string, unknown>
}

export type RuntimeExecutionOutput = {
  result?: unknown
  logs: string[]
  error?: string
}

export interface AgentRuntime {
  execute(input: RuntimeExecutionInput, policy?: Partial<RuntimePolicy>): Promise<RuntimeExecutionOutput>
}
