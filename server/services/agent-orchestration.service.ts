import type { OrchestrationRunStatus } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { prisma } from '@/server/db'
import { Orchestrator } from '@/server/agents/orchestration/orchestrator'
import type { OrchestrationGraph } from '@/server/agents/orchestration/types'

const orchestrator = new Orchestrator()

export async function createOrchestration(input: {
  ownerId: string
  workspaceId?: string | null
  name: string
  description?: string
  graph: OrchestrationGraph
}) {
  return prisma.agentOrchestration.create({
    data: {
      ownerId: input.ownerId,
      workspaceId: input.workspaceId,
      name: input.name,
      description: input.description,
      graph: input.graph,
    },
  })
}

export async function runOrchestration(input: {
  orchestrationId: string
  payload?: Record<string, unknown>
}) {
  const orchestration = await prisma.agentOrchestration.findUnique({
    where: { id: input.orchestrationId },
  })

  if (!orchestration) throw new Error('Orchestration not found')

  const run = await prisma.agentOrchestrationRun.create({
    data: {
      orchestrationId: orchestration.id,
      status: 'RUNNING',
      startedAt: new Date(),
      input: (input.payload ?? {}) as Prisma.InputJsonValue,
    },
  })

  try {
    const result = await orchestrator.run({
      runId: run.id,
      graph: orchestration.graph as OrchestrationGraph,
      workspaceId: orchestration.workspaceId,
      payload: input.payload,
    })

    const status: OrchestrationRunStatus = result.proposedActions.length > 0 ? 'WAITING_APPROVAL' : 'COMPLETED'

    return prisma.agentOrchestrationRun.update({
      where: { id: run.id },
      data: {
        status,
        output: result as Prisma.InputJsonValue,
        riskLevel: result.riskLevel,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      },
      include: {
        messages: true,
      },
    })
  } catch (error) {
    return prisma.agentOrchestrationRun.update({
      where: { id: run.id },
      data: {
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
        completedAt: new Date(),
      },
    })
  }
}
