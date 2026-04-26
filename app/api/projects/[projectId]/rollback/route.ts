import { NextResponse } from 'next/server'
import { approveRollback, proposeRollback } from '@/server/services/rollback.service'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params
  const body = await req.json().catch(() => ({}))

  const recommendation = await proposeRollback({
    projectId,
    deploymentId: body.deploymentId,
    environment: body.environment,
    performanceRegression: body.performanceRegression,
  })

  if (!recommendation.requiresApproval || body.autoApprove === true) {
    const result = await approveRollback({
      recommendationId: recommendation.id,
      approvedById: body.approvedById ?? 'admin-user',
      projectId,
    })
    return NextResponse.json({ recommendation, result })
  }

  return NextResponse.json({ recommendation }, { status: 202 })
}
