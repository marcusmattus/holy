import { NextResponse } from 'next/server'
import { getSelfHealingRuns, startSelfHealingRun } from '@/server/services/self-healing.service'

export async function GET() {
  const runs = await getSelfHealingRuns()
  return NextResponse.json({ runs })
}

export async function POST(req: Request) {
  const body = await req.json()
  const run = await startSelfHealingRun({
    triggerType: body.triggerType ?? 'MANUAL',
    sourceType: body.sourceType,
    sourceId: body.sourceId,
  })

  return NextResponse.json({ run }, { status: 201 })
}
