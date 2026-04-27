import { NextResponse } from 'next/server'
import { runOptimizationCampaign } from '@/server/services/optimization-campaign.service'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  const body = await req.json().catch(() => ({}))
  const { campaignId } = await params
  const run = await runOptimizationCampaign(campaignId, body.input)
  return NextResponse.json({ run }, { status: 201 })
}
