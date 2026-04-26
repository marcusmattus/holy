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
  const idempotencyKey = req.headers.get('idempotency-key')
  if (!idempotencyKey) {
    return NextResponse.json(
      { error: 'Missing idempotency-key header' },
      { status: 400 }
    )
  }

  const steps = Array.isArray(body.steps) ? body.steps : []
  for (const step of steps) {
    const isValid =
      step &&
      typeof step === 'object' &&
      typeof (step as { id?: unknown }).id === 'string' &&
      ((step as { type?: unknown }).type === 'task' ||
        (step as { type?: unknown }).type === 'approval') &&
      typeof (step as { action?: unknown }).action === 'string'
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid workflow steps payload' }, { status: 400 })
    }
  }

  const run = await enqueueWorkflowRun({
    workflowId,
    runId: body.runId ?? crypto.randomUUID(),
    idempotencyKey,
    actor,
    steps: steps as Array<{ id: string; type: 'task' | 'approval'; action: string }>,
  })

  return NextResponse.json(run)
}
