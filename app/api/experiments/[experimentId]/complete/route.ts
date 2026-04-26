import { NextResponse } from 'next/server'
import { completeExperiment } from '@/server/services/experiment.service'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ experimentId: string }> },
) {
  try {
    const { experimentId } = await params
    const body = await req.json()
    const experiment = await completeExperiment({
      experimentId,
      winner: body.winner,
      metrics: body.metrics,
    })
    return NextResponse.json(experiment)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to complete experiment' },
      { status: 400 },
    )
  }
}
