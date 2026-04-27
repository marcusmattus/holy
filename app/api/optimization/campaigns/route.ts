import { NextResponse } from 'next/server'
import {
  createOptimizationCampaign,
  listOptimizationCampaigns,
} from '@/server/services/optimization-campaign.service'

export async function GET() {
  const campaigns = await listOptimizationCampaigns()
  return NextResponse.json({ campaigns })
}

export async function POST(req: Request) {
  const body = await req.json()
  const campaign = await createOptimizationCampaign({
    workspaceId: body.workspaceId,
    projectId: body.projectId,
    listingId: body.listingId,
    name: body.name,
    goal: body.goal,
    successMetric: body.successMetric,
  })

  return NextResponse.json({ campaign }, { status: 201 })
}
