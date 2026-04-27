'use client'

import { useState } from 'react'

export function WorkspaceIntelligencePanel() {
  const [count, setCount] = useState(0)

  async function loadRecommendations() {
    const res = await fetch('/api/intelligence/recommendations')
    const data = await res.json()
    setCount(data.recommendations?.length ?? 0)
  }

  return (
    <div className="rounded-xl border border-[#C9A24A33] bg-[#0A0A0A]/80 p-4">
      <h3 className="text-[#C9A24A] font-semibold">Workspace Intelligence</h3>
      <button className="mt-3 rounded-md border border-[#C9A24A66] px-3 py-2 text-sm" onClick={loadRecommendations}>
        Refresh recommendations
      </button>
      <p className="mt-2 text-xs text-[#c4c4c4]">Recommendations available: {count}</p>
    </div>
  )
}
