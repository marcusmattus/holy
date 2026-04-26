import { NextResponse } from 'next/server'
import { approveAgentRun } from '@/server/services/agent.service'

function getUserId(req: Request) {
  return req.headers.get('x-user-id') ?? 'demo-user'
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ runId: string }> },
) {
  const { runId } = await params
  const run = await approveAgentRun(runId, getUserId(req))
  return NextResponse.json({ run })
}
