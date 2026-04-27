import { NextResponse } from 'next/server'
import { getCreatorPayoutSummary } from '@/server/services/payout.service'
import { prisma } from '@/server/db/client'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId') ?? 'demo-user'

  const [summary, payoutAccount, payouts] = await Promise.all([
    getCreatorPayoutSummary(userId),
    prisma.creatorPayoutAccount.findUnique({ where: { userId } }),
    prisma.payout.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ])

  return NextResponse.json({
    summary,
    payoutAccount,
    payouts,
  })
}
