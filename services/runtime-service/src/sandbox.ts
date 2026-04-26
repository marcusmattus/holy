import type { RuntimePolicy } from './policy'

export interface SandboxInput {
  executionId: string
  code: string
  policy: RuntimePolicy
}

export interface SandboxResult {
  output: string
  logs: string[]
  timedOut: boolean
}

export async function runInSandbox(input: SandboxInput): Promise<SandboxResult> {
  const truncatedCode = input.code.slice(0, 2_000)
  return {
    output: `Execution ${input.executionId} completed in sandbox`,
    logs: [`sandbox:policy.network=${input.policy.allowNetwork}`, `sandbox:code.size=${truncatedCode.length}`],
    timedOut: false,
  }
}
