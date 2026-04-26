import { NextResponse } from 'next/server'
import { prisma } from '@/server/db/client'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  const { workspaceId } = await params
  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId },
    include: { user: { select: { id: true, email: true } } },
  })

  return NextResponse.json({ members })
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  const { workspaceId } = await params
  const body = await req.json()
  const userId = String(body.userId || '')
  const role = body.role === 'ADMIN' || body.role === 'VIEWER' ? body.role : 'MEMBER'

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  const member = await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
    update: { role },
    create: {
      workspaceId,
      userId,
      role,
    },
  })

  return NextResponse.json({ member }, { status: 201 })
}
