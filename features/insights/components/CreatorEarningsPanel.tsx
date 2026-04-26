'use client'

import { useEffect, useMemo, useState } from 'react'

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

export function CreatorEarningsPanel({
  userId,
  onLoaded,
}: {
  userId: string
  onLoaded: (summary: SummaryResponse) => void
}) {
  const [summary, setSummary] = useState<SummaryResponse | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadSummary() {
      const res = await fetch(`/api/payouts/summary?userId=${encodeURIComponent(userId)}`)
      if (!res.ok) {
        return
      }
      const data = (await res.json()) as SummaryResponse
      if (!cancelled) {
        setSummary(data)
        onLoaded(data)
      }
    }

    loadSummary()

    return () => {
      cancelled = true
    }
  }, [onLoaded, userId])

  const metrics = useMemo(() => {
    if (!summary) {
      return [
        { label: 'Total revenue', value: '—' },
        { label: 'Available payout balance', value: '—' },
        { label: 'Pending revenue shares', value: '—' },
        { label: 'Paid out total', value: '—' },
      ]
    }

    const totalRevenue =
      summary.availableBalance + summary.pendingRevenueShares + summary.paidOutTotal

    return [
      { label: 'Total revenue', value: `£${(totalRevenue / 100).toFixed(2)}` },
      {
        label: 'Available payout balance',
        value: `£${(summary.availableBalance / 100).toFixed(2)}`,
      },
      {
        label: 'Pending revenue shares',
        value: `£${(summary.pendingRevenueShares / 100).toFixed(2)}`,
      },
      { label: 'Paid out total', value: `£${(summary.paidOutTotal / 100).toFixed(2)}` },
    ]
  }, [summary])

  async function requestPayout() {
    await fetch('/api/payouts/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    window.location.reload()
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
          </div>
        ))}
      </div>
      <button
        onClick={requestPayout}
        className="rounded-lg border border-[#EAB308]/60 bg-[#EAB308]/20 px-4 py-2 text-sm font-semibold text-[#FDE68A] hover:bg-[#EAB308]/30"
      >
        Request payout
      </button>
    </div>
  )
}
