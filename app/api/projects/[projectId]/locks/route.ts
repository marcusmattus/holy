import { NextResponse } from 'next/server'
import { acquireFileLock, listActiveFileLocks, releaseFileLock } from '@/server/services/collaboration.service'

export async function GET(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const userId = new URL(req.url).searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  try {
    const locks = await listActiveFileLocks(projectId, userId)
    return NextResponse.json({ locks })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 403 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const body = await req.json()

  if (!body.userId || typeof body.userId !== 'string' || !body.filePath || typeof body.filePath !== 'string') {
    return NextResponse.json({ error: 'userId and filePath are required' }, { status: 400 })
  }

  try {
    const lock = await acquireFileLock({
      projectId,
      userId: body.userId,
      filePath: body.filePath,
      ttlMs: typeof body.ttlMs === 'number' ? body.ttlMs : undefined,
    })
    return NextResponse.json({ lock })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 403 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const body = await req.json()

  if (!body.userId || typeof body.userId !== 'string' || !body.filePath || typeof body.filePath !== 'string') {
    return NextResponse.json({ error: 'userId and filePath are required' }, { status: 400 })
  }

  try {
    await releaseFileLock({
      projectId,
      userId: body.userId,
      filePath: body.filePath,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 403 })
  }
}
