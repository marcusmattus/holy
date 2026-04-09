import Link from 'next/link'

export const metadata = { title: 'Rewards — Holy' }

const PAYOUTS = [
  {
    id: '1',
    amount: 124.5,
    date: '2025-01-15',
    status: 'completed',
    txHash: '0xabc...def',
  },
  {
    id: '2',
    amount: 89.2,
    date: '2025-01-01',
    status: 'completed',
    txHash: '0x123...456',
  },
  {
    id: '3',
    amount: 210.0,
    date: '2024-12-15',
    status: 'completed',
    txHash: '0x789...abc',
  },
]

export default function RewardsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard/revenue" className="hover:text-foreground">
          Revenue
        </Link>
        <span>/</span>
        <span className="text-foreground">Rewards</span>
      </div>
      <h1 className="text-2xl font-bold">On-chain Rewards</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Claimable</p>
          <p className="text-3xl font-bold mt-1 text-[#10B981]">$423.70</p>
          <button className="mt-4 rounded-lg bg-[#10B981] px-4 py-2 text-sm font-semibold text-[#0A0A0F] hover:bg-[#059669] transition-colors">
            Claim USDC
          </button>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total Paid Out</p>
          <p className="text-3xl font-bold mt-1">$1,847.20</p>
          <p className="text-xs text-muted-foreground mt-1">
            via on-chain settlements
          </p>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Payout History</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Amount
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Date
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Tx Hash
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {PAYOUTS.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">
                  ${p.amount.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.date}</td>
                <td className="px-4 py-3 text-[#7C3AED] font-mono text-xs">
                  {p.txHash}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#10B981]/20 text-[#10B981]">
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
