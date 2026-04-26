import { NextResponse } from 'next/server'
import { runOrchestration } from '@/server/services/agent-orchestration.service'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orchestrationId: string }> },
) {
  const { orchestrationId } = await params
  const body = await request.json().catch(() => ({}))

  const run = await runOrchestration({
    orchestrationId,
    payload: body?.input,
  })

  return NextResponse.json(run)
}
