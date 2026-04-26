'use client'

import { useCallback, useMemo, useState } from 'react'
import { CreatorEarningsPanel } from '@/features/insights/components/CreatorEarningsPanel'
import { PayoutAccountCard } from '@/features/insights/components/PayoutAccountCard'
import { PayoutHistory } from '@/features/insights/components/PayoutHistory'
import { ListingOptimizationPanel } from '@/features/store/components/ListingOptimizationPanel'

type SummaryResponse = {
  availableBalance: number
  pendingRevenueShares: number
  paidOutTotal: number
  payoutAccount: {
    onboardingStatus: string
    payoutsEnabled: boolean
  } | null
  payouts: Array<{
    id: string
    amountCents: number
    currency: string
    status: string
    createdAt: string
  }>
}

export default function CreatorDashboardPage() {
  const userId = 'demo-user'
  const [summary, setSummary] = useState<SummaryResponse | null>(null)

  const topApps = useMemo(
    () => [
      { name: 'Commerce Kit', revenueCents: 42120 },
      { name: 'Analytics Pro', revenueCents: 29840 },
      { name: 'Auth Module', revenueCents: 18600 },
    ],
    [],
  )

  const referralRevenue = useMemo(() => 9400, [])

  const handleLoaded = useCallback((nextSummary: SummaryResponse) => {
    setSummary(nextSummary)
  }, [])

  return (
    <div className="space-y-6 bg-[#08080B] min-h-full rounded-2xl p-4 md:p-6 [font-family:'Space_Grotesk',ui-sans-serif,system-ui]">
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Creator economy</p>
        <h1 className="text-2xl font-semibold mt-2">Creator earnings</h1>
      </div>

      <CreatorEarningsPanel userId={userId} onLoaded={handleLoaded} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">Top apps by revenue</p>
          <div className="space-y-3">
            {topApps.map((app) => (
              <div key={app.name} className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-sm">{app.name}</span>
                <span className="text-sm text-muted-foreground">£{(app.revenueCents / 100).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Referral revenue: £{(referralRevenue / 100).toFixed(2)}</p>
        </div>
        <PayoutAccountCard
          userId={userId}
          statusLabel={summary?.payoutAccount?.onboardingStatus ?? 'PENDING'}
          payoutsEnabled={Boolean(summary?.payoutAccount?.payoutsEnabled)}
        />
      </div>

      <PayoutHistory payouts={summary?.payouts ?? []} />

      <ListingOptimizationPanel listingId="demo-listing" />
    </div>
  )
}
