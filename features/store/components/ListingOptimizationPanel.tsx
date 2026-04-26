'use client'

import { useState } from 'react'

type Optimization = {
  improvedTitle: string
  improvedDescription: string
  suggestedCategory: string
  pricingSuggestion: string
  conversionSuggestions: string[]
}

export function ListingOptimizationPanel({ slug }: { slug: string }) {
  const [data, setData] = useState<Optimization | null>(null)
  const [loading, setLoading] = useState(false)

  async function loadOptimization() {
    setLoading(true)
    const res = await fetch(`/api/store/${slug}/optimize`)
    const json = await res.json()
    setData(json)
    setLoading(false)
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">AI Listing Optimization</h3>
          <p className="text-xs text-muted-foreground">
            Product and marketing recommendations for better listing conversion.
          </p>
        </div>
        <button
          onClick={loadOptimization}
          className="rounded-lg bg-[#7C3AED] px-3 py-1.5 text-xs font-semibold text-white"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Optimize'}
        </button>
      </div>
      {data ? (
        <div className="mt-4 space-y-2 text-xs text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Improved title:</span>{' '}
            {data.improvedTitle}
          </p>
          <p>
            <span className="font-semibold text-foreground">Improved description:</span>{' '}
            {data.improvedDescription}
          </p>
          <p>
            <span className="font-semibold text-foreground">Category:</span>{' '}
            {data.suggestedCategory}
          </p>
          <p>
            <span className="font-semibold text-foreground">Pricing:</span>{' '}
            {data.pricingSuggestion}
          </p>
          <ul className="list-disc pl-4">
            {data.conversionSuggestions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
