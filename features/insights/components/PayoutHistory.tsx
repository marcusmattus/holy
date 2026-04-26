'use client'

import { useRouter } from 'next/navigation'

type PayoutRow = {
  id: string
  amountCents: number
  currency: string
  status: string
  createdAt: string
}

function formatMoney(amountCents: number, currency: string) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amountCents / 100)
}

export function PayoutHistory({
  payouts,
  userId,
  canRequest,
}: {
  payouts: PayoutRow[]
  userId: string
  canRequest: boolean
}) {
  const router = useRouter()

  async function requestPayout() {
    await fetch('/api/payouts/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    router.refresh()
  }

  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Payout history
        </p>
        <button
          disabled={!canRequest}
          onClick={requestPayout}
          className="rounded-lg border border-[#D4AF37]/70 bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          Request payout
        </button>
      </div>
      <div className="mt-4 space-y-2">
        {payouts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No payouts yet.</p>
        ) : (
          payouts.map((payout) => (
            <div
              key={payout.id}
              className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-sm"
            >
              <div>
                <p className="font-medium">
                  {formatMoney(payout.amountCents, payout.currency)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(payout.createdAt).toLocaleDateString()} · {payout.currency}
                </p>
              </div>
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                {payout.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
