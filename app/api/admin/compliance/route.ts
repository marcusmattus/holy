import { NextResponse } from 'next/server'
import {
  listComplianceQueue,
  queueComplianceReview,
} from '@/server/services/compliance.service'

export async function GET() {
  const queue = await listComplianceQueue()
  return NextResponse.json(queue)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const review = await queueComplianceReview({
      targetType: body.targetType,
      targetId: body.targetId,
      riskLevel: body.riskLevel,
      checks: body.checks,
      notes: body.notes,
    })
    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to queue review' },
      { status: 400 },
    )
  }
}
