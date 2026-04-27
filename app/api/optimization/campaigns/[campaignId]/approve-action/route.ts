import { NextResponse } from 'next/server'
import { approveOptimizationAction } from '@/server/services/optimization-campaign.service'

export async function POST(req: Request) {
  const body = await req.json()
  const run = await approveOptimizationAction(
    body.runId,
    body.actionId,
    body.approverId ?? 'admin-user',
  )
  return NextResponse.json({ run })
}
