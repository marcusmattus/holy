import { NextResponse } from 'next/server'
import { cancelWorkflow } from '@/server/services/workflow-engine.service'
import { getActor, requireAdmin } from '@/server/services/access-control.service'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    const actor = requireAdmin(req.headers, 'workflow.cancel')
    const { runId } = await params
    return NextResponse.json(cancelWorkflow(runId, actor))
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ runId: string }> }
) {
  const { runId } = await params
  return NextResponse.json({ runId, actor: getActor(req.headers), status: 'PENDING' })
}
