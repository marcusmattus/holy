import Link from 'next/link'
import { Coins, TrendingUp, Zap, ArrowUpRight, Shield, Info } from 'lucide-react'
import { WalletConnect } from '@/components/revenue/wallet-connect'

export const metadata = { title: 'Holystic Protocol — Holy' }

// Demo ledger entries (replaced by real DB data via /api/protocol/ledger)
const LEDGER = [
  {
    id: '1',
    type: 'INSTALL_BOUNTY',
    amountUsdc: 12.5,
    amountHol: 50,
    description: 'Holy Commerce — 25 installs',
    status: 'SETTLED',
    settledAt: '2026-05-01',
  },
  {
    id: '2',
    type: 'REVENUE_SHARE',
    amountUsdc: 84.2,
    amountHol: 0,
    description: 'Revenue share — April 2026',
    status: 'SETTLED',
    settledAt: '2026-04-30',
  },
  {
    id: '3',
    type: 'REFERRAL',
    amountUsdc: 25.0,
    amountHol: 100,
    description: 'Referral bonus — 2 signups',
    status: 'SETTLED',
    settledAt: '2026-04-22',
  },
  {
    id: '4',
    type: 'CREATOR_GRANT',
    amountUsdc: 200.0,
    amountHol: 500,
    description: 'Creator grant — Q1 2026',
    status: 'SETTLED',
    settledAt: '2026-04-01',
  },
  {
    id: '5',
    type: 'PROTOCOL_BONUS',
    amountUsdc: 102.0,
    amountHol: 200,
    description: 'Protocol participation bonus',
    status: 'PENDING',
    settledAt: null,
  },
]

const TYPE_META: Record<string, { label: string; color: string }> = {
  INSTALL_BOUNTY: { label: 'Install Bounty', color: 'text-[#7C3AED] bg-[#7C3AED]/10' },
  REVENUE_SHARE: { label: 'Revenue Share', color: 'text-[#C9A24A] bg-[#C9A24A]/10' },
  REFERRAL: { label: 'Referral', color: 'text-[#2563EB] bg-[#2563EB]/10' },
  CREATOR_GRANT: { label: 'Creator Grant', color: 'text-[#10B981] bg-[#10B981]/10' },
  PROTOCOL_BONUS: { label: 'Protocol Bonus', color: 'text-pink-500 bg-pink-500/10' },
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  SETTLED: { label: 'Settled', color: 'text-[#10B981] bg-[#10B981]/10' },
  PENDING: { label: 'Pending', color: 'text-[#C9A24A] bg-[#C9A24A]/10' },
  PROCESSING: { label: 'Processing', color: 'text-[#2563EB] bg-[#2563EB]/10' },
  FAILED: { label: 'Failed', color: 'text-destructive bg-destructive/10' },
}

export default function RewardsPage() {
  const claimable = LEDGER.filter((l) => l.status === 'PENDING').reduce(
    (sum, l) => sum + l.amountUsdc,
    0,
  )
  const totalPaid = LEDGER.filter((l) => l.status === 'SETTLED').reduce(
    (sum, l) => sum + l.amountUsdc,
    0,
  )
  const totalHol = LEDGER.reduce((sum, l) => sum + l.amountHol, 0)

  return (
    <div className="space-y-6 relative">
      <div className="ethereal-bg" />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard/revenue" className="hover:text-foreground transition-colors">
          Revenue
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Holystic Protocol</span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#C9A24A] flex items-center justify-center flex-shrink-0">
          <Coins size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Holystic Protocol</h1>
          <p className="text-sm text-muted-foreground">
            On-chain rewards, revenue sharing, and creator incentives
          </p>
        </div>
      </div>

      {/* Protocol info banner */}
      <div className="rounded-xl border border-[#C9A24A]/20 bg-[#C9A24A]/5 p-4 flex gap-3">
        <Info size={16} className="text-[#C9A24A] flex-shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground space-y-1">
          <p>
            <span className="text-foreground font-medium">Earn automatically.</span>{' '}
            Install bounties pay out in USDC when users install your Store apps.
            Revenue share is calculated monthly from subscription and one-time purchases.
            HOL tokens are used for governance and unlock protocol bonuses.
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#10B981]/30 bg-[#10B981]/5 p-6 space-y-3">
          <div className="flex items-center gap-2 text-[#10B981]">
            <Zap size={15} />
            <p className="text-sm font-medium">Claimable Now</p>
          </div>
          <p className="text-3xl font-bold text-[#10B981]">
            ${claimable.toFixed(2)}
          </p>
          <button className="w-full rounded-lg bg-[#10B981] px-4 py-2 text-sm font-semibold text-[#0A0A0F] hover:bg-[#059669] transition-colors">
            Claim USDC
          </button>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield size={15} />
            <p className="text-sm font-medium">Total Settled</p>
          </div>
          <p className="text-3xl font-bold">${totalPaid.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">via on-chain USDC settlements</p>
        </div>

        <div className="rounded-xl border border-[#C9A24A]/30 bg-[#C9A24A]/5 p-6 space-y-3">
          <div className="flex items-center gap-2 text-[#C9A24A]">
            <TrendingUp size={15} />
            <p className="text-sm font-medium">HOL Tokens</p>
          </div>
          <p className="text-3xl font-bold text-[#C9A24A]">{totalHol.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Used for governance & bonuses</p>
        </div>
      </div>

      {/* Reward type breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <TrendingUp size={14} className="text-[#C9A24A]" />
            Reward Breakdown
          </h2>
          <div className="space-y-3">
            {Object.entries(TYPE_META).map(([type, { label, color }]) => {
              const total = LEDGER.filter((l) => l.type === type).reduce(
                (sum, l) => sum + l.amountUsdc,
                0,
              )
              const max = Math.max(
                ...Object.keys(TYPE_META).map((t) =>
                  LEDGER.filter((l) => l.type === t).reduce((s, l) => s + l.amountUsdc, 0),
                ),
              )
              return (
                <div key={type} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-0.5 rounded-full font-medium ${color}`}>{label}</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-[#7C3AED] rounded-full transition-all"
                      style={{ width: `${max > 0 ? (total / max) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <WalletConnect />
      </div>

      {/* Ledger table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-sm">Reward Ledger</h2>
          <Link
            href="/api/protocol/ledger"
            className="text-xs text-[#7C3AED] hover:underline flex items-center gap-1"
          >
            Export <ArrowUpRight size={11} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                {['Type', 'Description', 'USDC', 'HOL', 'Date', 'Status'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {LEDGER.map((entry) => {
                const type = TYPE_META[entry.type]
                const status = STATUS_META[entry.status]
                return (
                  <tr key={entry.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${type?.color}`}>
                        {type?.label ?? entry.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs max-w-[200px] truncate">
                      {entry.description}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#10B981]">
                      +${entry.amountUsdc.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-[#C9A24A] font-medium">
                      {entry.amountHol > 0 ? `+${entry.amountHol}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {entry.settledAt ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status?.color}`}>
                        {status?.label ?? entry.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
