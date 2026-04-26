import { NextResponse } from 'next/server'
import { executeAgentRuntime } from '@/server/services/agent-runtime.service'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params
    const body = await req.json()
    const execution = await executeAgentRuntime({
      agentId,
      workspaceId: body.workspaceId,
      input: {
        script: body.script ?? '',
        payload: body.payload,
      },
    })

    return NextResponse.json(execution)
  } catch {
    return NextResponse.json(
      { error: 'Runtime execution failed' },
      { status: 400 }
    )
  }
}
