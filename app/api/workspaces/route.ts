import { NextResponse } from 'next/server'
import { prisma } from '@/server/db/client'

export async function GET(req: Request) {
  const userId = new URL(req.url).searchParams.get('userId')
  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  const workspaces = await prisma.workspace.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } },
      ],
    },
    include: {
      members: true,
    },
  })

  return NextResponse.json(workspaces)
}

export async function POST(req: Request) {
  const { userId, name, slug } = (await req.json()) as {
    userId?: string
    name?: string
    slug?: string
  }

  if (!userId || !name || !slug) {
    return NextResponse.json({ error: 'userId, name and slug are required' }, { status: 400 })
  }

  const workspace = await prisma.workspace.create({
    data: {
      name,
      slug,
      ownerId: userId,
      members: {
        create: {
          userId,
          role: 'OWNER',
        },
      },
    },
    include: {
      members: true,
    },
  })

  return NextResponse.json(workspace)
}
