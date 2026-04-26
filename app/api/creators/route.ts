import { NextResponse } from 'next/server'
import { prisma } from '@/server/db/client'

export async function GET() {
  const creators = await prisma.creatorProfile.findMany({
    where: { isPublic: true },
    include: {
      user: { select: { id: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ creators })
}

export async function POST(req: Request) {
  const body = await req.json()
  if (!body.userId || typeof body.userId !== 'string' || !body.handle || typeof body.handle !== 'string') {
    return NextResponse.json({ error: 'userId and handle are required' }, { status: 400 })
  }

  const profile = await prisma.creatorProfile.upsert({
    where: { userId: body.userId },
    update: {
      handle: body.handle,
      bio: body.bio,
      avatarUrl: body.avatarUrl,
      websiteUrl: body.websiteUrl,
      isPublic: body.isPublic ?? true,
    },
    create: {
      userId: body.userId,
      handle: body.handle,
      bio: body.bio,
      avatarUrl: body.avatarUrl,
      websiteUrl: body.websiteUrl,
      isPublic: body.isPublic ?? true,
    },
  })

  return NextResponse.json({ profile })
}
