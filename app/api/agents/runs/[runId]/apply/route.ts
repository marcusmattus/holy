import { AgentRunStatus, WorkspaceRole } from '@prisma/client'
import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { incrementMetric } from '@/server/observability/metrics'
import { trackAnalyticsEvent } from '@/server/observability/events'
import { requireWorkspaceRole } from '@/server/security/permissions'
import { writeAuditLog } from '@/server/security/audit-log'
import { ALLOWED_LISTING_UPDATE_FIELDS } from '@/server/agents/types'

const MAX_TAG_LENGTH = 32
const MAX_TAG_COUNT = 20

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

function sanitizeText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim().slice(0, maxLength)
  return normalized.length > 0 ? normalized : undefined
}

function sanitizeListingUpdate(fields: Record<string, unknown>) {
  const updateData: Record<string, string | number | string[]> = {}

  const name = sanitizeText(fields.name, 120)
  if (name) updateData.name = name

  const description = sanitizeText(fields.description, 4000)
  if (description) updateData.description = description

  const category = sanitizeText(fields.category, 80)
  if (category) updateData.category = category

  const visibility = sanitizeText(fields.visibility, 32)
  if (visibility) updateData.visibility = visibility

  if (isValidPrice(fields.price)) {
    updateData.price = fields.price
  }

  if (Array.isArray(fields.tags)) {
    const tags = fields.tags
      .filter((tag): tag is string => typeof tag === 'string')
      .map((tag) => tag.trim().slice(0, MAX_TAG_LENGTH))
      .filter((tag) => tag.length > 0)
      .slice(0, MAX_TAG_COUNT)
    if (tags.length > 0) {
      updateData.tags = tags
    }
  }

  return updateData
}

function isValidPrice(value: unknown): value is number {
  return typeof value === 'number' && value >= 0 && Number.isFinite(value)
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
      const rawFields = Object.fromEntries(
        Object.entries(action.fields).filter(([key]) =>
          ALLOWED_LISTING_UPDATE_FIELDS.includes(
            key as (typeof ALLOWED_LISTING_UPDATE_FIELDS)[number],
          ),
        ),
      )
      const fields = sanitizeListingUpdate(rawFields)
      if (Object.keys(fields).length === 0) {
        continue
      }
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
