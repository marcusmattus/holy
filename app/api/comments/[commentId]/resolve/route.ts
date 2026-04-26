import { NextResponse } from 'next/server'
import { resolveStudioComment } from '@/server/services/collaboration.service'

export async function POST(req: Request, { params }: { params: Promise<{ commentId: string }> }) {
  const { commentId } = await params
  const body = await req.json()

  if (!body.userId || typeof body.userId !== 'string') {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  try {
    const comment = await resolveStudioComment(commentId, body.userId)
    return NextResponse.json({ comment })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 403 })
  }
}
