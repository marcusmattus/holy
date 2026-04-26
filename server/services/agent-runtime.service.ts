import { PrismaClient, RuntimeExecutionStatus } from '@prisma/client'
import type { RuntimeExecutionInput } from '@/server/runtime/agent-runtime'
import { DEFAULT_RUNTIME_POLICY } from '@/server/runtime/runtime-policy'
import { SimulatedSandboxProvider } from '@/server/runtime/providers/simulated-sandbox.provider'
import { NodeVmProvider } from '@/server/runtime/providers/node-vm.provider'
import { auditLog } from '@/server/observability/logger'

const prisma = new PrismaClient()

function getProvider() {
  return process.env.HOLY_RUNTIME_PROVIDER === 'node-vm'
    ? new NodeVmProvider()
    : new SimulatedSandboxProvider()
}

export async function executeAgentRuntime(params: {
  agentId?: string
  workspaceId?: string
  input: RuntimeExecutionInput
}) {
  const provider = getProvider()
  const execution = await prisma.agentRuntimeExecution.create({
    data: {
      agentId: params.agentId,
      workspaceId: params.workspaceId,
      status: RuntimeExecutionStatus.RUNNING,
      input: JSON.parse(JSON.stringify(params.input)) as object,
      startedAt: new Date(),
    },
  })

  const policy = DEFAULT_RUNTIME_POLICY
  const result = await provider.run(params.input, policy)
  const status = result.error
    ? RuntimeExecutionStatus.FAILED
    : RuntimeExecutionStatus.COMPLETED

  const updated = await prisma.agentRuntimeExecution.update({
    where: { id: execution.id },
    data: {
      status,
      output: result.result as object | undefined,
      logs: result.logs,
      error: result.error,
      completedAt: new Date(),
    },
  })

  auditLog({
    action: 'runtime.execute',
    actor: 'system',
    resource: params.agentId,
    metadata: { executionId: updated.id, status: updated.status },
  })

  return updated
}
