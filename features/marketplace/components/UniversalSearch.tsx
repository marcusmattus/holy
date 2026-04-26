'use client'

import { useState } from 'react'

export function UniversalSearch() {
  const [query, setQuery] = useState('')

  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-4">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search apps, templates, agents, workflows"
        className="w-full rounded-xl border border-[#303030] bg-[#111] px-3 py-2 text-sm text-white"
      />
    </div>
  )
}
