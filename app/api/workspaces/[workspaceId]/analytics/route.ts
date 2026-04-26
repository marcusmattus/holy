import { NextResponse } from 'next/server'
import { getWorkspaceAnalytics } from '@/server/services/workspace-analytics.service'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  const { workspaceId } = await params
  const data = await getWorkspaceAnalytics(workspaceId)
  return NextResponse.json(data)
}
