import { NextResponse } from 'next/server'
import { createOrchestration } from '@/server/services/agent-orchestration.service'
import { prisma } from '@/server/db'
import { getRequestUserId, getRequestWorkspaceId } from '@/server/services/request-context'

export async function GET(request: Request) {
  const ownerId = getRequestUserId(request)
  const workspaceId = getRequestWorkspaceId(request)

  const orchestrations = await prisma.agentOrchestration.findMany({
    where: {
      ownerId,
      workspaceId: workspaceId ?? undefined,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(orchestrations)
}

export async function POST(request: Request) {
  const ownerId = getRequestUserId(request)
  const workspaceId = getRequestWorkspaceId(request)
  const body = await request.json()

  if (!body?.name || !body?.graph) {
    return NextResponse.json({ error: 'name and graph are required' }, { status: 400 })
  }

  const orchestration = await createOrchestration({
    ownerId,
    workspaceId,
    name: body.name,
    description: body.description,
    graph: body.graph,
  })

  return NextResponse.json(orchestration, { status: 201 })
}
