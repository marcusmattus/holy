'use client'

import { useState } from 'react'

export function PostmortemGenerator({ incidentId }: { incidentId: string }) {
  const [result, setResult] = useState<string>('No draft generated yet')

  async function generateDraft() {
    const res = await fetch(`/api/admin/incidents/${incidentId}/postmortem`, {
      method: 'POST',
    })
    const data = await res.json()
    setResult(`Draft ${data.postmortem.id} created (requires human approval before publish).`)
  }

  return (
    <div className="rounded-xl border border-[#C9A24A33] bg-[#0A0A0A]/80 p-4">
      <h3 className="text-[#C9A24A] font-semibold">Incident Postmortem Generator</h3>
      <button className="mt-3 rounded-md border border-[#C9A24A66] px-3 py-2 text-sm" onClick={generateDraft}>
        Generate draft
      </button>
      <p className="mt-2 text-xs text-[#c4c4c4]">{result}</p>
    </div>
  )
}
