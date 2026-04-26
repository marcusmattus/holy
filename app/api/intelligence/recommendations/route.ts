import { NextResponse } from 'next/server'
import {
  generateRecommendations,
  listRecommendations,
} from '@/server/intelligence/recommendation-engine'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const workspaceId = searchParams.get('workspaceId') ?? undefined
  const projectId = searchParams.get('projectId') ?? undefined
  const recommendations = await listRecommendations({ workspaceId, projectId })
  return NextResponse.json({ recommendations })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const recommendations = await generateRecommendations({
    workspaceId: body.workspaceId,
    projectId: body.projectId,
  })
  return NextResponse.json({ recommendations }, { status: 201 })
}
