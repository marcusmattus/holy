'use client'

import { useEffect, useState } from 'react'

export function RewardSummaryCard({ userId }: { userId: string }) {
  const [summary, setSummary] = useState<Record<string, number>>({})

  useEffect(() => {
    fetch(`/api/rewards/summary?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setSummary(data.summary ?? {}))
  }, [userId])

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-white">
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A24A]">
        Holystic Rewards
      </p>
      <h3 className="mt-3 text-3xl font-bold tracking-tight">Reward Balance</h3>
      <div className="mt-6 space-y-3">
        {Object.entries(summary).map(([currency, amount]) => (
          <div
            key={currency}
            className="flex items-center justify-between border-b border-white/10 pb-3"
          >
            <span className="text-sm text-white/50">{currency}</span>
            <span className="font-bold">{amount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
