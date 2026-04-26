import { AgentRunStatus, WorkspaceRole } from '@prisma/client'
import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { incrementMetric } from '@/server/observability/metrics'
import { trackAnalyticsEvent } from '@/server/observability/events'
import { requireWorkspaceRole } from '@/server/security/permissions'
import { writeAuditLog } from '@/server/security/audit-log'

const allowedListingFields = ['name', 'description', 'price', 'category', 'tags', 'visibility']

type ProposalAction =
  | { type: 'PATCH_FILES'; files: Record<string, string>; summary: string }
  | { type: 'UPDATE_LISTING'; fields: Record<string, unknown>; summary: string }
  | { type: 'CREATE_GROWTH_SUGGESTION'; fields: Record<string, unknown>; summary: string }
  | { type: 'RUN_QA'; summary: string }
  | { type: 'DEPLOY_PREVIEW'; summary: string }

type AgentProposal = {
  title: string
  summary: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  actions: ProposalAction[]
}

function getUserId(req: Request) {
  return req.headers.get('x-user-id') ?? 'demo-user'
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ runId: string }> },
) {
  const { runId } = await params
  const body = (await req.json()) as { confirmHighRisk?: boolean }

  const run = await prisma.agentRun.findUnique({
    where: { id: runId },
    include: { agent: true },
  })
  if (!run) {
    return NextResponse.json({ error: 'run not found' }, { status: 404 })
  }
  if (run.status !== AgentRunStatus.APPROVED) {
    return NextResponse.json({ error: 'run must be approved first' }, { status: 400 })
  }

  const userId = getUserId(req)
  if (run.agent.workspaceId) {
    const allowed = await requireWorkspaceRole(
      run.agent.workspaceId,
      userId,
      WorkspaceRole.ADMIN,
    )
    if (!allowed) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  } else if (run.agent.ownerId !== userId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const proposal = (run.proposal ?? null) as AgentProposal | null
  if (!proposal) {
    return NextResponse.json({ error: 'proposal missing' }, { status: 400 })
  }

  if (proposal.riskLevel === 'HIGH' && !body.confirmHighRisk) {
    return NextResponse.json(
      { error: 'high risk proposals require confirmHighRisk=true' },
      { status: 400 },
    )
  }

  for (const action of proposal.actions) {
    if (action.type === 'PATCH_FILES' && run.projectId) {
      await prisma.projectVersion.create({
        data: {
          projectId: run.projectId,
          label: `agent-run-${run.id}`,
          code: JSON.stringify(action.files),
        },
      })
      continue
    }

    if (action.type === 'UPDATE_LISTING' && run.listingId) {
      const fields = Object.fromEntries(
        Object.entries(action.fields).filter(([key]) =>
          allowedListingFields.includes(key),
        ),
      )
      await prisma.storeListing.update({
        where: { id: run.listingId },
        data: fields,
      })
    }
  }

  const updatedRun = await prisma.agentRun.update({
    where: { id: runId },
    data: { status: AgentRunStatus.APPLIED, appliedAt: new Date() },
  })

  incrementMetric('agent_runs_applied_total')
  await trackAnalyticsEvent({
    eventName: 'agent.run.applied',
    actorId: userId,
    workspaceId: run.agent.workspaceId ?? undefined,
    metadata: { runId },
  })
  await writeAuditLog({
    actorId: userId,
    action: 'agent.run.applied',
    targetType: 'AgentRun',
    targetId: runId,
    workspaceId: run.agent.workspaceId ?? undefined,
  })

  return NextResponse.json({ run: updatedRun })
}
