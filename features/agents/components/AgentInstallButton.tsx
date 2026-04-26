'use client'

import { useState } from 'react'

export function AgentInstallButton({
  listingSlug,
  disabled,
}: {
  listingSlug: string
  disabled?: boolean
}) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string>()

  async function handleInstall() {
    setLoading(true)
    setMessage(undefined)
    const res = await fetch(`/api/agents/marketplace/${listingSlug}/install`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'demo-user' }),
    })
    const payload = await res.json()
    setMessage(payload.error ?? 'Installed successfully')
    setLoading(false)
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={disabled || loading}
        onClick={handleInstall}
        className="rounded-md border border-[#C9A24A]/30 bg-[#C9A24A]/10 px-4 py-2 text-sm text-[#C9A24A] disabled:opacity-50"
      >
        {loading ? 'Installing…' : 'Install agent'}
      </button>
      {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
    </div>
  )
}
