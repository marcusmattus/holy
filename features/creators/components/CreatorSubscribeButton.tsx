"use client"

import { useState } from 'react'

export default function CreatorSubscribeButton({ handle }: { handle: string }) {
  const [loading, setLoading] = useState(false)

  async function subscribe() {
    setLoading(true)
    const response = await fetch(`/api/creators/${handle}/subscribe`, { method: 'POST' })
    const payload = await response.json()
    if (payload.checkoutUrl) {
      window.location.href = payload.checkoutUrl
      return
    }
    setLoading(false)
  }

  return (
    <button
      onClick={subscribe}
      disabled={loading}
      className="rounded-md border border-[#C9A24A] bg-[#C9A24A]/10 px-4 py-2 text-sm text-[#C9A24A]"
    >
      {loading ? 'Redirecting…' : 'Subscribe'}
    </button>
  )
}
