import { NextResponse } from 'next/server'
import { getExperimentResults } from '@/server/services/experiment-analysis.service'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ experimentId: string }> },
) {
  const { experimentId } = await params
  const result = await getExperimentResults(experimentId)
  return NextResponse.json(result)
}
