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

const MAX_SANDBOX_CODE_LENGTH = 2_000

export async function runInSandbox(input: SandboxInput): Promise<SandboxResult> {
  const truncatedCode = input.code.slice(0, MAX_SANDBOX_CODE_LENGTH)
  const wasTruncated = input.code.length > MAX_SANDBOX_CODE_LENGTH
  return {
    output: `Execution ${input.executionId} completed in sandbox`,
    logs: [
      `sandbox:policy.network=${input.policy.allowNetwork}`,
      `sandbox:code.size=${truncatedCode.length}`,
      `sandbox:code.truncated=${wasTruncated}`,
    ],
    timedOut: false,
  }
}
