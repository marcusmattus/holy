import { CreatorEarningsPanel } from '@/features/insights/components/CreatorEarningsPanel'
import { PayoutAccountCard } from '@/features/insights/components/PayoutAccountCard'
import { PayoutHistory } from '@/features/insights/components/PayoutHistory'
import { getCreatorPayoutSummary } from '@/server/services/payout.service'
import { prisma } from '@/server/db/client'

export const metadata = { title: 'Creator Dashboard — Holy' }
export const dynamic = 'force-dynamic'

export default async function CreatorDashboardPage() {
  const userId = 'demo-user'
  const [summary, account, payouts] = await Promise.all([
    getCreatorPayoutSummary(userId).catch(() => ({
      availableCents: 0,
      pendingCents: 0,
      paidOutCents: 0,
      referralRevenueCents: 0,
      topAppsByRevenue: [],
    })),
    prisma.creatorPayoutAccount.findUnique({ where: { userId } }).catch(() => null),
    prisma.payout
      .findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      })
      .catch(() => []),
  ])

  return (
    <div className="space-y-6 bg-[#0A0A0F]">
      <div>
        <h1 className="font-['Space_Grotesk'] text-2xl font-bold">Creator economy</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track earnings, connect payouts, and scale your creator revenue.
        </p>
      </div>
      <CreatorEarningsPanel summary={summary} />
      <div className="grid gap-6 lg:grid-cols-2">
        <PayoutAccountCard account={account} userId={userId} />
        <PayoutHistory
          payouts={payouts.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() }))}
          userId={userId}
          canRequest={Boolean(account?.payoutsEnabled && summary.availableCents > 0)}
        />
      </div>
    </div>
  )
}
