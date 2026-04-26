import { RewardSummaryCard } from '@/features/monetization/components/RewardSummaryCard'

export const metadata = { title: 'Rewards Dashboard — Holy' }

export default function RewardsDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Rewards dashboard</h1>
        <p className="mt-1 text-sm text-white/60">Track reward balances and payout-ready records.</p>
      </div>
      <RewardSummaryCard userId="demo-user" />
    </div>
  )
}
