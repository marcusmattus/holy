'use client'

type PayoutAccount = {
  onboardingStatus: string
  payoutsEnabled: boolean
  chargesEnabled: boolean
}

export function PayoutAccountCard({
  account,
  userId,
}: {
  account: PayoutAccount | null
  userId: string
}) {
  async function connectPayouts() {
    const res = await fetch('/api/payouts/connect/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.assign(data.url)
    }
  }

  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md">
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        Payout account
      </p>
      <div className="mt-3 space-y-2 text-sm">
        <p>Status: {account?.onboardingStatus ?? 'NOT_CONNECTED'}</p>
        <p>Payouts enabled: {account?.payoutsEnabled ? 'Yes' : 'No'}</p>
        <p>Charges enabled: {account?.chargesEnabled ? 'Yes' : 'No'}</p>
      </div>
      <button
        onClick={connectPayouts}
        className="mt-4 rounded-lg border border-[#D4AF37]/70 bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black hover:bg-[#E3C35A]"
      >
        {account ? 'Refresh payouts connection' : 'Connect payouts'}
      </button>
    </div>
  )
}
