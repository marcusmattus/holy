import {
  AgentRunStatus,
  AgentStatus,
  AgentType,
  WorkspaceRole,
  type Prisma,
} from '@prisma/client'
import { prisma } from '@/server/db'
import { runAgent } from '@/server/agents/core/agent-runner'
import { requireWorkspaceRole } from '@/server/security/permissions'
import { writeAuditLog } from '@/server/security/audit-log'
import { trackAnalyticsEvent } from '@/server/observability/events'

export async function createAgent(input: {
  ownerId: string
  name: string
  type: AgentType
  workspaceId?: string
  config?: Prisma.InputJsonValue
}) {
  if (input.workspaceId) {
    const allowed = await requireWorkspaceRole(
      input.workspaceId,
      input.ownerId,
      WorkspaceRole.MEMBER,
    )
    if (!allowed) throw new Error('FORBIDDEN')
  }

  const agent = await prisma.agent.create({
    data: {
      ownerId: input.ownerId,
      name: input.name,
      type: input.type,
      workspaceId: input.workspaceId,
      config: input.config,
      status: AgentStatus.ACTIVE,
    },
  })

  await writeAuditLog({
    actorId: input.ownerId,
    action: 'agent.created',
    targetType: 'Agent',
    targetId: agent.id,
    workspaceId: input.workspaceId,
    metadata: { type: input.type, name: input.name },
  })

  return agent
}

export async function listAgents(ownerId: string, workspaceId?: string) {
  return prisma.agent.findMany({
    where: {
      ownerId,
      workspaceId,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function runAgentById(input: {
  agentId: string
  userId: string
  projectId?: string
  listingId?: string
}) {
  const agent = await prisma.agent.findUnique({ where: { id: input.agentId } })
  if (!agent) throw new Error('NOT_FOUND')
  if (agent.status !== AgentStatus.ACTIVE) throw new Error('AGENT_INACTIVE')

  if (agent.workspaceId) {
    const allowed = await requireWorkspaceRole(
      agent.workspaceId,
      input.userId,
      WorkspaceRole.MEMBER,
    )
    if (!allowed) throw new Error('FORBIDDEN')
  } else if (agent.ownerId !== input.userId) {
    throw new Error('FORBIDDEN')
  }

  return runAgent({
    agentId: agent.id,
    type: agent.type,
    userId: input.userId,
    workspaceId: agent.workspaceId ?? undefined,
    projectId: input.projectId,
    listingId: input.listingId,
  })
}

export async function approveAgentRun(runId: string, userId: string) {
  const run = await prisma.agentRun.findUnique({
    where: { id: runId },
    include: { agent: true },
  })
  if (!run) throw new Error('NOT_FOUND')
  if (run.status !== AgentRunStatus.PROPOSED) throw new Error('INVALID_STATUS')
  if (run.agent.workspaceId) {
    const allowed = await requireWorkspaceRole(
      run.agent.workspaceId,
      userId,
      WorkspaceRole.ADMIN,
    )
    if (!allowed) throw new Error('FORBIDDEN')
  } else if (run.agent.ownerId !== userId) {
    throw new Error('FORBIDDEN')
  }

  const approved = await prisma.agentRun.update({
    where: { id: runId },
    data: {
      status: AgentRunStatus.APPROVED,
      approvedAt: new Date(),
    },
  })

  await writeAuditLog({
    actorId: userId,
    action: 'agent.run.approved',
    targetType: 'AgentRun',
    targetId: runId,
    workspaceId: run.agent.workspaceId ?? undefined,
  })

  await trackAnalyticsEvent({
    eventName: 'agent.run.approved',
    actorId: userId,
    workspaceId: run.agent.workspaceId ?? undefined,
    metadata: { runId },
  })

  return approved
}
