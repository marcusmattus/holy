import { EarningsSummary } from '@/components/revenue/earnings-summary'
import { FinancialModel } from '@/components/revenue/financial-model'
import { WalletConnect } from '@/components/revenue/wallet-connect'
import Link from 'next/link'

export const metadata = { title: 'Revenue — Holy' }

export default function RevenuePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Revenue</h1>
          <p className="text-muted-foreground text-sm mt-1">Your earnings across the Holy ecosystem</p>
        </div>
        <Link
          href="/dashboard/revenue/rewards"
          className="rounded-lg border border-[#7C3AED] text-[#7C3AED] px-4 py-2 text-sm font-medium hover:bg-[#7C3AED]/10 transition-colors"
        >
          View Rewards →
        </Link>
      </div>
      <EarningsSummary />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinancialModel />
        <WalletConnect />
      </div>
    </div>
  )
}
