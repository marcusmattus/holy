import { NextResponse } from 'next/server'
import { approveWorkflowStep } from '@/server/services/workflow.service'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ runId: string }> },
) {
  try {
    const { runId } = await params
    const body = await req.json()
    const run = await approveWorkflowStep(runId, body.stepId)
    return NextResponse.json(run)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to approve step' },
      { status: 400 },
    )
  }
}
