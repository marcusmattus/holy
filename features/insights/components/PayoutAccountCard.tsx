'use client'

type PayoutAccountCardProps = {
  userId: string
  statusLabel: string
  payoutsEnabled: boolean
}

export function PayoutAccountCard({
  userId,
  statusLabel,
  payoutsEnabled,
}: PayoutAccountCardProps) {
  async function connectPayouts() {
    const res = await fetch('/api/payouts/connect/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    const data = (await res.json()) as { url?: string }
    if (data.url) {
      window.location.href = data.url
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 space-y-4">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Payout account</p>
      <p className="text-lg font-semibold">{statusLabel}</p>
      <p className="text-sm text-muted-foreground">
        {payoutsEnabled ? 'Transfers enabled in Stripe Connect.' : 'Complete onboarding to enable payouts.'}
      </p>
      <button
        onClick={connectPayouts}
        className="rounded-lg border border-[#EAB308]/60 bg-[#EAB308]/20 px-4 py-2 text-sm font-semibold text-[#FDE68A] hover:bg-[#EAB308]/30"
      >
        Connect payouts
      </button>
    </div>
  )
}
