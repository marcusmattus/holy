type Payout = {
  id: string
  amountCents: number
  currency: string
  status: string
  createdAt: string
}

export function PayoutHistory({ payouts }: { payouts: Payout[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">Payout history</p>
      <div className="space-y-3">
        {payouts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No payouts yet.</p>
        ) : (
          payouts.map((payout) => (
            <div key={payout.id} className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <p className="text-sm font-medium">{(payout.amountCents / 100).toFixed(2)} {payout.currency.toUpperCase()}</p>
                <p className="text-xs text-muted-foreground">{new Date(payout.createdAt).toLocaleString()}</p>
              </div>
              <span className="text-xs uppercase tracking-wide text-muted-foreground">{payout.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
