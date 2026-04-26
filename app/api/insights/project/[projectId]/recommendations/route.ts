import { NextResponse } from 'next/server'
import { getProjectGrowthRecommendations } from '@/server/services/growth-recommendation.service'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params
  const insights = await getProjectGrowthRecommendations(projectId)
  return NextResponse.json(insights)
}
