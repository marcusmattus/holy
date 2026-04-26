import { NextResponse } from 'next/server'
import { enqueueWorkflowRun } from '@/server/services/workflow-engine.service'
import { getActor } from '@/server/services/access-control.service'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  const body = await req.json()
  const { workflowId } = await params
  const actor = getActor(req.headers)
  const idempotencyKey = req.headers.get('idempotency-key') ?? crypto.randomUUID()

  const run = await enqueueWorkflowRun({
    workflowId,
    runId: body.runId ?? crypto.randomUUID(),
    idempotencyKey,
    actor,
    steps: Array.isArray(body.steps) ? body.steps : [],
  })

  return NextResponse.json(run)
}
