"use client"

import { useState } from 'react'

export default function TemplateCheckoutButton({ templateId, paid }: { templateId: string; paid: boolean }) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    const response = await fetch(`/api/templates/${templateId}/checkout`, { method: 'POST' })
    const payload = await response.json()
    if (payload.checkoutUrl) {
      window.location.href = payload.checkoutUrl
      return
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleClick}
      className="rounded-md border border-[#C9A24A] bg-[#C9A24A]/10 px-4 py-2 text-sm text-[#C9A24A]"
      disabled={loading}
    >
      {loading ? 'Loading…' : paid ? 'Buy Template' : 'Use Template'}
    </button>
  )
}
