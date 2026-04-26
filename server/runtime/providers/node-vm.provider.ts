import vm from 'node:vm'
import type { RuntimeExecutionInput, RuntimeExecutionOutput } from '@/server/runtime/agent-runtime'
import type { SandboxProvider } from '@/server/runtime/sandbox-provider'
import type { RuntimePolicy } from '@/server/runtime/runtime-policy'

export class NodeVmProvider implements SandboxProvider {
  async run(input: RuntimeExecutionInput, policy: RuntimePolicy): Promise<RuntimeExecutionOutput> {
    const logs: string[] = []
    const sandbox = {
      payload: input.payload ?? {},
      tools: Object.fromEntries(policy.allowedTools.map((tool) => [tool, () => `${tool}:ok`])),
      console: {
        log: (...args: unknown[]) => logs.push(args.map(String).join(' ')),
      },
    }

    try {
      const context = vm.createContext(sandbox)
      const script = new vm.Script(input.script)
      const result = script.runInContext(context, { timeout: policy.timeoutMs })
      return { logs, result }
    } catch (error) {
      return {
        logs,
        error: error instanceof Error ? error.message : 'Runtime execution failed',
      }
    }
  }
}
