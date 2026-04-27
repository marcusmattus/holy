import { NextResponse } from 'next/server'
import { prisma } from '@/server/db/client'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  const shares = await prisma.revenueShare.findMany({
    where: { recipientId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      purchase: {
        include: {
          listing: true,
        },
      },
    },
  })

  return NextResponse.json({ shares })
}
