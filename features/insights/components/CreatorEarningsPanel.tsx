'use client'

type CreatorSummary = {
  availableCents: number
  pendingCents: number
  paidOutCents: number
  referralRevenueCents: number
  topAppsByRevenue: Array<{
    listingId: string | null
    revenueCents: number
  }>
}

function formatMoney(amountCents: number) {
  return `£${(amountCents / 100).toFixed(2)}`
}

export function CreatorEarningsPanel({ summary }: { summary: CreatorSummary }) {
  const total = summary.availableCents + summary.pendingCents + summary.paidOutCents
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md">
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        Creator earnings
      </p>
      <h2 className="mt-2 text-2xl font-semibold">{formatMoney(total)}</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Available payout" value={formatMoney(summary.availableCents)} />
        <Metric label="Pending shares" value={formatMoney(summary.pendingCents)} />
        <Metric label="Paid out total" value={formatMoney(summary.paidOutCents)} />
        <Metric label="Referral revenue" value={formatMoney(summary.referralRevenueCents)} />
      </div>
      <div className="mt-6">
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Top apps by revenue
        </p>
        <div className="mt-2 space-y-2">
          {summary.topAppsByRevenue.length === 0 ? (
            <p className="text-sm text-muted-foreground">No revenue data yet.</p>
          ) : (
            summary.topAppsByRevenue.map((app) => (
              <div
                key={app.listingId ?? 'unknown'}
                className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-sm"
              >
                <span>{app.listingId ?? 'Unmapped listing'}</span>
                <span className="font-semibold">{formatMoney(app.revenueCents)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-medium">{value}</p>
    </div>
  )
}
