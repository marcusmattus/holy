'use client'

import { useState } from 'react'

export function PluginInstallButton({ pluginId }: { pluginId: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'installed' | 'error'>('idle')

  async function handleInstall() {
    setStatus('loading')
    const res = await fetch(`/api/plugins/${pluginId}/install`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: 'project-demo', installedById: 'user-demo' }),
    })

    setStatus(res.ok ? 'installed' : 'error')
  }

  return (
    <button
      onClick={handleInstall}
      className="rounded-md border border-[#C9A24A]/50 bg-[#C9A24A]/10 px-3 py-2 text-sm text-[#F8F2E5] hover:bg-[#C9A24A]/20"
    >
      {status === 'loading' ? 'Installing…' : status === 'installed' ? 'Installed' : status === 'error' ? 'Retry install' : 'Install plugin'}
    </button>
  )
}
