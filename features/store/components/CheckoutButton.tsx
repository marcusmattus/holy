'use client'

import { useState } from 'react'

export function CheckoutButton({
  listingId,
  buyerId,
}: {
  listingId: string
  buyerId: string
}) {
  const [error, setError] = useState('')

  async function checkout() {
    setError('')

    const res = await fetch(`/api/store/${listingId}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buyerId }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data?.error ?? 'Unable to start checkout')
      return
    }

    if (data.mode === 'free') {
      window.location.href = '/dashboard/projects'
      return
    }

    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={checkout}
        className="rounded-full bg-[#C9A24A] px-5 py-3 text-sm font-bold text-black transition hover:brightness-110"
        type="button"
      >
        Install / Buy App
      </button>
      {error ? <p className="text-center text-xs text-red-400">{error}</p> : null}
    </div>
  )
}
