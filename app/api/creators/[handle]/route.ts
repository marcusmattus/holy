import { NextResponse } from 'next/server'
import { prisma } from '@/server/db/client'

export async function GET(_: Request, { params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const creator = await prisma.creatorProfile.findUnique({
    where: { handle },
    include: {
      user: {
        include: {
          projects: { orderBy: { createdAt: 'desc' } },
          templates: {
            where: { status: 'PUBLISHED' },
            include: { forks: true },
            orderBy: { createdAt: 'desc' },
          },
          creatorFollowsReceived: true,
        },
      },
    },
  })

  if (!creator || !creator.isPublic) {
    return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
  }

  const followerCount = creator.user.creatorFollowsReceived.length
  return NextResponse.json({
    creator: {
      ...creator,
      metrics: {
        followers: followerCount,
        publishedApps: creator.user.projects.length,
        templates: creator.user.templates.length,
      },
    },
  })
}
