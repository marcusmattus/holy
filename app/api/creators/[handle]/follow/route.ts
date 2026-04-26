import { NextResponse } from 'next/server'
import { prisma } from '@/server/db/client'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ handle: string }> },
) {
  const { handle } = await params
  const body = await req.json()

  if (!body.followerId || typeof body.followerId !== 'string') {
    return NextResponse.json({ error: 'followerId is required' }, { status: 400 })
  }

  const creator = await prisma.creatorProfile.findUnique({ where: { handle } })
  if (!creator) {
    return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
  }

  const follow = await prisma.creatorFollow.upsert({
    where: {
      creatorId_followerId: {
        creatorId: creator.userId,
        followerId: body.followerId,
      },
    },
    update: {},
    create: {
      creatorId: creator.userId,
      followerId: body.followerId,
    },
  })

  return NextResponse.json({ follow })
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ handle: string }> },
) {
  const { handle } = await params
  const body = await req.json()

  if (!body.followerId || typeof body.followerId !== 'string') {
    return NextResponse.json({ error: 'followerId is required' }, { status: 400 })
  }

  const creator = await prisma.creatorProfile.findUnique({ where: { handle } })
  if (!creator) {
    return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
  }

  await prisma.creatorFollow.deleteMany({
    where: {
      creatorId: creator.userId,
      followerId: body.followerId,
    },
  })

  return NextResponse.json({ success: true })
}
