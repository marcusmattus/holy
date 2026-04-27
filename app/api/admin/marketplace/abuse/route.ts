import { NextResponse } from 'next/server'
import { listMarketplaceAbuse, recordMarketplaceAbuseAnalysis } from '@/server/services/marketplace-abuse.service'

export async function GET() {
  return NextResponse.json(listMarketplaceAbuse())
}

export async function POST(req: Request) {
  const body = await req.json()
  return NextResponse.json(
    recordMarketplaceAbuseAnalysis(body.targetType, body.targetId, body.metrics ?? {
      installVelocity: 0,
      reviewPatternScore: 0,
      duplicateContentScore: 0,
      reportSpike: 0,
      refundSpike: 0,
      referralAbuseScore: 0,
      rankingSwing: 0,
    }),
  )
}
