"use client"

import { useState } from 'react'

type Suggestion = {
  id: string
  title: string
  description: string
  status: string
}

export default function AiGrowthAgentPanel({ projectId }: { projectId?: string }) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  async function runAgents() {
    await fetch('/api/agents/growth/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId }),
    })
    const response = await fetch(`/api/agents/growth/suggestions?projectId=${projectId ?? ''}`)
    const payload = await response.json()
    setSuggestions(payload.suggestions ?? [])
  }

  return (
    <div className="rounded-xl border border-[#C9A24A]/25 bg-white/5 p-4 text-white">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#C9A24A]">AI Growth Agent</h3>
        <button
          onClick={runAgents}
          className="rounded-md border border-[#C9A24A] bg-[#C9A24A]/10 px-3 py-1 text-xs text-[#C9A24A]"
        >
          Run
        </button>
      </div>
      <div className="space-y-2">
        {suggestions.length === 0 ? (
          <p className="text-xs text-white/50">No suggestions yet.</p>
        ) : (
          suggestions.map((item) => (
            <div key={item.id} className="rounded-lg border border-white/10 bg-black/30 p-3">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="mt-1 text-xs text-white/70">{item.description}</p>
              <p className="mt-1 text-[11px] uppercase tracking-wide text-[#C9A24A]">{item.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
