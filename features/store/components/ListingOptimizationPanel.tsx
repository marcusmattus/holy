'use client'

import { useState } from 'react'

type OptimizationResult = {
  improvedTitle: string
  improvedDescription: string
  suggestedCategory: string
  pricingSuggestion: string
  conversionSuggestions: string[]
}

export function ListingOptimizationPanel({ listingId }: { listingId: string }) {
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [loading, setLoading] = useState(false)

  async function optimize() {
    setLoading(true)
    const res = await fetch(`/api/store/${listingId}/optimize`, { method: 'POST' })
    const data = (await res.json()) as OptimizationResult
    setResult(data)
    setLoading(false)
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 space-y-4">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">AI listing optimization</p>
      <button
        onClick={optimize}
        disabled={loading}
        className="rounded-lg border border-[#EAB308]/60 bg-[#EAB308]/20 px-4 py-2 text-sm font-semibold text-[#FDE68A] hover:bg-[#EAB308]/30 disabled:opacity-70"
      >
        {loading ? 'Optimizing…' : 'Run optimizer'}
      </button>
      {result ? (
        <div className="space-y-2 text-sm">
          <p><span className="text-muted-foreground">Improved title:</span> {result.improvedTitle}</p>
          <p><span className="text-muted-foreground">Suggested category:</span> {result.suggestedCategory}</p>
          <p><span className="text-muted-foreground">Pricing:</span> {result.pricingSuggestion}</p>
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            {result.conversionSuggestions.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
