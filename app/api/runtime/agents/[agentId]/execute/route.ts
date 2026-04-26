import { NextResponse } from 'next/server'
import { executeAgentRuntime } from '@/server/services/agent-runtime.service'
import { getActor, requireAdmin } from '@/server/services/access-control.service'
import { auditLog } from '@/server/observability/logger'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const actor = requireAdmin(req.headers, 'runtime.execute')
    const { agentId } = await params
    const body = await req.json()
    if (typeof body.script !== 'string' || body.script.length === 0 || body.script.length > 10_000) {
      return NextResponse.json({ error: 'Invalid script payload' }, { status: 400 })
    }

    const execution = await executeAgentRuntime({
      agentId,
      workspaceId: body.workspaceId,
      input: {
        script: body.script,
        payload: body.payload,
      },
    })
    auditLog({ action: 'runtime.execute.request', actor, resource: agentId })
    return NextResponse.json(execution)
  } catch {
    auditLog({ action: 'runtime.execute.denied', actor: getActor(req.headers) })
    return NextResponse.json(
      { error: 'Runtime execution failed' },
      { status: 400 }
    )
  }
}
