import { NextResponse } from 'next/server'
import {
  getWorkspaceIntelligencePolicy,
  upsertWorkspaceIntelligencePolicy,
} from '@/server/intelligence/intelligence-policy'

export async function GET(_req: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await params
  return NextResponse.json(getWorkspaceIntelligencePolicy(workspaceId))
}

export async function PATCH(req: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await params
  const body = await req.json()
  try {
    return NextResponse.json(upsertWorkspaceIntelligencePolicy(workspaceId, body))
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
