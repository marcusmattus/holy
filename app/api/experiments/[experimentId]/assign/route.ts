import { NextResponse } from 'next/server'
import { assignExperimentVariant } from '@/server/services/experiment-assignment.service'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ experimentId: string }> },
) {
  const { experimentId } = await params
  const body = await request.json()

  if (!body?.sessionId || typeof body.sessionId !== 'string') {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 })
  }

  const exposure = await assignExperimentVariant({
    experimentId,
    sessionId: body.sessionId,
  })

  return NextResponse.json(exposure)
}
