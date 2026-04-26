import { NextResponse } from 'next/server'
import { runAgentById } from '@/server/services/agent.service'

function getUserId(req: Request) {
  return req.headers.get('x-user-id') ?? 'demo-user'
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ agentId: string }> },
) {
  const { agentId } = await params
  const body = (await req.json()) as { projectId?: string; listingId?: string }

  const run = await runAgentById({
    agentId,
    userId: getUserId(req),
    projectId: body.projectId,
    listingId: body.listingId,
  })

  return NextResponse.json({ run }, { status: 201 })
}
