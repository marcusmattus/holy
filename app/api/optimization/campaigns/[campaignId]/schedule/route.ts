import { NextResponse } from 'next/server'
import { createOptimizationSchedule } from '@/server/services/optimization-schedule.service'

export async function POST(req: Request, { params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = await params
  const body = await req.json()
  try {
    const schedule = createOptimizationSchedule({
      campaignId,
      workspaceId: body.workspaceId,
      cron: body.cron,
      riskLevel: body.riskLevel,
      policyApproved: body.policyApproved,
    })
    return NextResponse.json(schedule)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
