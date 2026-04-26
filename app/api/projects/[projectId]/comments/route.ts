import { NextResponse } from 'next/server'
import { createStudioComment, listStudioComments } from '@/server/services/collaboration.service'

export async function GET(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const userId = new URL(req.url).searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  try {
    const comments = await listStudioComments(projectId, userId)
    return NextResponse.json({ comments })
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

  if (!body.body || typeof body.body !== 'string') {
    return NextResponse.json({ error: 'body is required' }, { status: 400 })
  }

  try {
    const comment = await createStudioComment({
      projectId,
      userId: body.userId,
      body: body.body,
      filePath: body.filePath,
      componentId: body.componentId,
      versionId: body.versionId,
    })
    return NextResponse.json({ comment })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 403 })
  }
}
