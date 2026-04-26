'use client'

import { useState } from 'react'

export function ImprovementBundlePanel() {
  const [message, setMessage] = useState('No bundle applied')

  async function createAndApply() {
    const created = await fetch('/api/improvement-bundles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Conversion uplift bundle',
        summary: 'Bundle app + listing + workflow improvements',
        actions: ['patch app files', 'update listing copy draft', 'create experiment'],
      }),
    })

    const createdData = await created.json()
    await fetch(`/api/improvement-bundles/${createdData.bundle.id}/apply`, { method: 'POST' })
    setMessage(`Applied bundle ${createdData.bundle.id}`)
  }

  return (
    <div className="rounded-xl border border-[#C9A24A33] bg-[#0A0A0A]/80 p-4">
      <h3 className="text-[#C9A24A] font-semibold">Improvement Bundles</h3>
      <button className="mt-3 rounded-md border border-[#C9A24A66] px-3 py-2 text-sm" onClick={createAndApply}>
        Create and apply demo bundle
      </button>
      <p className="mt-2 text-xs text-[#c4c4c4]">{message}</p>
    </div>
  )
}
