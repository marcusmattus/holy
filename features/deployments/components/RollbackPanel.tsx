'use client'

import { useState } from 'react'

export function RollbackPanel({ projectId }: { projectId: string }) {
  const [status, setStatus] = useState('Idle')

  async function requestRollback() {
    setStatus('Requesting...')
    const res = await fetch(`/api/projects/${projectId}/rollback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ environment: 'production', performanceRegression: true }),
    })

    const data = await res.json()
    setStatus(data.result ? 'Rollback applied' : 'Approval required')
  }

  return (
    <div className="rounded-xl border border-[#C9A24A33] bg-[#0A0A0A]/80 p-4">
      <h3 className="text-[#C9A24A] font-semibold">Rollback Control</h3>
      <p className="text-sm text-[#d2d2d2] mt-2">Suggest safe rollback after regressions.</p>
      <button
        className="mt-4 rounded-md border border-[#C9A24A66] px-3 py-2 text-sm"
        onClick={requestRollback}
      >
        Propose rollback
      </button>
      <p className="text-xs text-[#a0a0a0] mt-2">{status}</p>
    </div>
  )
}
