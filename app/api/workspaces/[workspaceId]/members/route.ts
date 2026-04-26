import { NextResponse } from 'next/server'
import { prisma } from '@/server/db/client'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  const { workspaceId } = await params
  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId },
    include: { user: true },
  })

  return NextResponse.json(members)
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  const { workspaceId } = await params
  const { userId, role = 'MEMBER' } = (await req.json()) as {
    userId?: string
    role?: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'
  }

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
    create: {
      workspaceId,
      userId,
      role,
    },
    update: {
      role,
    },
  })

  return NextResponse.json(member)
}
