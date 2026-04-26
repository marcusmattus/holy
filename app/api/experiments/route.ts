import { NextResponse } from 'next/server'
import { proposeABExperiment } from '@/server/agents/ab-testing-agent'
import {
  createExperiment,
  listExperiments,
} from '@/server/services/experiment.service'

export async function GET() {
  const experiments = await listExperiments()
  return NextResponse.json(experiments)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const proposal = proposeABExperiment({
      entityName: body.entityName ?? 'Listing headline',
      baselineMetric: body.baselineMetric ?? 'conversion',
    })
    const experiment = await createExperiment({
      projectId: body.projectId,
      listingId: body.listingId,
      name: body.name ?? proposal.name,
      hypothesis: body.hypothesis ?? proposal.hypothesis,
      variants: body.variants ?? proposal.variants,
    })
    return NextResponse.json({ proposal, experiment }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to create experiment' },
      { status: 400 },
    )
  }
}
