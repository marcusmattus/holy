import { AgentRunStatus, type AgentType } from '@prisma/client'
import { prisma } from '@/server/db'
import { getAgent } from '@/server/agents/core/agent-registry'
import { incrementMetric } from '@/server/observability/metrics'
import { trackAnalyticsEvent } from '@/server/observability/events'
import type { Prisma } from '@prisma/client'

export async function runAgent(input: {
  agentId: string
  type: AgentType
  userId: string
  workspaceId?: string
  projectId?: string
  listingId?: string
}) {
  const run = await prisma.agentRun.create({
    data: {
      agentId: input.agentId,
      projectId: input.projectId,
      listingId: input.listingId,
      status: AgentRunStatus.RUNNING,
      input: {
        workspaceId: input.workspaceId,
        userId: input.userId,
      },
    },
  })

  try {
    const proposal = await getAgent(input.type).run({
      agentId: input.agentId,
      workspaceId: input.workspaceId,
      projectId: input.projectId,
      listingId: input.listingId,
      userId: input.userId,
    })
    const updated = await prisma.agentRun.update({
      where: { id: run.id },
      data: {
        status: AgentRunStatus.PROPOSED,
        summary: proposal.summary,
        proposal: proposal as Prisma.InputJsonValue,
        output: proposal as Prisma.InputJsonValue,
      },
    })
    incrementMetric('agent_runs_total')
    await trackAnalyticsEvent({
      eventName: 'agent.run.proposed',
      actorId: input.userId,
      workspaceId: input.workspaceId,
      metadata: { agentId: input.agentId, runId: run.id, type: input.type },
    })
    return updated
  } catch (error) {
    const err = error instanceof Error ? error.message : 'Unknown agent failure'
    await prisma.agentRun.update({
      where: { id: run.id },
      data: {
        status: AgentRunStatus.FAILED,
        error: err,
      },
    })
    incrementMetric('agent_runs_failed_total')
    throw error
  }
}
