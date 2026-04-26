import { NextResponse } from 'next/server'
import { decideComplianceReview } from '@/server/services/compliance.service'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ reviewId: string }> },
) {
  try {
    const { reviewId } = await params
    const body = await req.json()
    const review = await decideComplianceReview({
      reviewId,
      status: body.status,
      reviewedById: body.reviewedById,
      notes: body.notes,
    })
    return NextResponse.json(review)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to decide review' },
      { status: 400 },
    )
  }
}
