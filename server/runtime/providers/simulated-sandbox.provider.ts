import type { RuntimeExecutionInput, RuntimeExecutionOutput } from '@/server/runtime/agent-runtime'
import type { SandboxProvider } from '@/server/runtime/sandbox-provider'
import type { RuntimePolicy } from '@/server/runtime/runtime-policy'

export class SimulatedSandboxProvider implements SandboxProvider {
  async run(input: RuntimeExecutionInput, policy: RuntimePolicy): Promise<RuntimeExecutionOutput> {
    const logs = [
      'sandbox=simulated',
      `timeoutMs=${policy.timeoutMs}`,
      `tools=${policy.allowedTools.join(',') || 'none'}`,
    ]

    if (!input.script?.trim()) {
      return { logs, error: 'Missing script' }
    }

    return {
      logs,
      result: {
        mode: 'simulated',
        accepted: true,
        payload: input.payload ?? null,
      },
    }
  }
}
