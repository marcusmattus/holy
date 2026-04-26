import { NextResponse } from 'next/server'
import { listActiveStudioSessions, upsertStudioPresence } from '@/server/services/collaboration.service'

export async function GET(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const userId = new URL(req.url).searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  try {
    const sessions = await listActiveStudioSessions(projectId, userId)
    return NextResponse.json({ sessions })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 403 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const body = await req.json()

  if (!body.userId || typeof body.userId !== 'string') {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  try {
    const session = await upsertStudioPresence({
      projectId,
      userId: body.userId,
      metadata: body.metadata,
    })
    return NextResponse.json({ session })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 403 })
  }
}
