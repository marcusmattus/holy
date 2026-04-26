import { AgentType } from '@prisma/client'
import { NextResponse } from 'next/server'
import { createAgent, listAgents } from '@/server/services/agent.service'
import { SUPPORTED_AGENT_TYPES } from '@/server/agents/types'
import type { Prisma } from '@prisma/client'

function getUserId(req: Request) {
  return req.headers.get('x-user-id') ?? 'demo-user'
}

export async function GET(req: Request) {
  const userId = getUserId(req)
  const { searchParams } = new URL(req.url)
  const workspaceId = searchParams.get('workspaceId') ?? undefined
  const agents = await listAgents(userId, workspaceId)
  return NextResponse.json({ agents })
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    name?: string
    type?: AgentType
    workspaceId?: string
    config?: Record<string, unknown>
  }

  if (!body.name || !body.type) {
    return NextResponse.json(
      { error: 'name and type are required' },
      { status: 400 },
    )
  }

  if (!SUPPORTED_AGENT_TYPES.includes(body.type)) {
    return NextResponse.json({ error: 'unsupported agent type' }, { status: 400 })
  }

  const agent = await createAgent({
    ownerId: getUserId(req),
    name: body.name,
    type: body.type,
    workspaceId: body.workspaceId,
    config: body.config as Prisma.InputJsonValue | undefined,
  })

  return NextResponse.json({ agent }, { status: 201 })
}
