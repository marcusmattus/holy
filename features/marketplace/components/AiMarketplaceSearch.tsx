'use client'

import { useState } from 'react'

interface MarketplaceResponse {
  query: string
  recommendations: Array<{
    id: string
    title: string
    why: string
    paid: boolean
    certified: boolean
    trusted: boolean
  }>
  disclaimer: string
}

export function AiMarketplaceSearch() {
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState<MarketplaceResponse | null>(null)

  async function handleSearch() {
    const result = await fetch('/api/search/marketplace/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, tenantId: 'public' }),
    })

    setResponse((await result.json()) as MarketplaceResponse)
  }

  return (
    <div className="rounded-xl border border-[#C9A24A33] bg-[#0A0A0A]/90 p-4 shadow-[0_0_40px_rgba(201,162,74,0.12)] font-['Space_Grotesk']">
      <h3 className="text-[#C9A24A] text-sm uppercase tracking-widest">AI Marketplace Discovery</h3>
      <div className="mt-3 flex gap-2">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask for apps, templates, agents, workflows, plugins, integrations"
          className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm"
        />
        <button onClick={handleSearch} className="rounded-md bg-[#C9A24A] px-3 py-2 text-black text-sm">
          Ask
        </button>
      </div>
      {response ? (
        <div className="mt-4 space-y-3 text-sm">
          {response.recommendations.map((item) => (
            <div key={item.id} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-center gap-2">
                <strong>{item.title}</strong>
                {item.paid ? <span className="rounded-full border border-[#C9A24A66] px-2 py-0.5 text-xs">Paid</span> : null}
                {item.certified ? <span className="rounded-full border border-emerald-500/40 px-2 py-0.5 text-xs">Certified</span> : null}
                {item.trusted ? <span className="rounded-full border border-sky-500/40 px-2 py-0.5 text-xs">Trusted</span> : null}
              </div>
              <p className="opacity-80">{item.why}</p>
            </div>
          ))}
          <p className="text-xs opacity-70">{response.disclaimer}</p>
        </div>
      ) : null}
    </div>
  )
}
