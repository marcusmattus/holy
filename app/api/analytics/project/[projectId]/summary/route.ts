import { NextResponse } from 'next/server'
import { getProjectAnalyticsSummary } from '@/server/services/analytics.service'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params
  const summary = await getProjectAnalyticsSummary(projectId)
  return NextResponse.json({ summary })
}
