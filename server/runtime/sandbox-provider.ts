import type { RuntimeExecutionInput, RuntimeExecutionOutput } from '@/server/runtime/agent-runtime'
import type { RuntimePolicy } from '@/server/runtime/runtime-policy'

export interface SandboxProvider {
  run(input: RuntimeExecutionInput, policy: RuntimePolicy): Promise<RuntimeExecutionOutput>
}
