'use client'

import { useState } from 'react'

type PriceType = 'FREE' | 'ONE_TIME' | 'SUBSCRIPTION'

export function PricingSetupPanel({
  listingId,
  initialPriceType = 'FREE',
  initialPriceCents = 0,
}: {
  listingId: string
  initialPriceType?: PriceType
  initialPriceCents?: number
}) {
  const [priceType, setPriceType] = useState<PriceType>(initialPriceType)
  const [priceCents, setPriceCents] = useState(initialPriceCents)

  async function save() {
    await fetch('/api/store/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: listingId,
        name: 'Monetized Listing',
        description: 'Updated pricing setup',
        priceType,
        priceCents,
      }),
    })
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-white">
      <h3 className="text-xl font-semibold">Pricing setup</h3>
      <p className="mt-2 text-sm text-white/60">Configure free, one-time, or subscription pricing.</p>
      <div className="mt-4 space-y-4">
        <select
          value={priceType}
          onChange={(event) => setPriceType(event.target.value as PriceType)}
          className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm"
        >
          <option value="FREE">Free</option>
          <option value="ONE_TIME">One-time</option>
          <option value="SUBSCRIPTION">Subscription</option>
        </select>
        <input
          type="number"
          min={0}
          value={priceCents}
          onChange={(event) => setPriceCents(Number(event.target.value))}
          className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm"
          placeholder="Price in cents"
        />
      </div>
      <button
        type="button"
        className="mt-4 rounded-lg bg-[#C9A24A] px-4 py-2 text-sm font-semibold text-black"
        onClick={save}
      >
        Save pricing
      </button>
    </div>
  )
}
