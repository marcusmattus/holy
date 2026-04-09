'use client'

import { useState } from 'react'

const SAMPLE_CODE = `'use client'

import { useState } from 'react'

export function HeroSection() {
  const [email, setEmail] = useState('')

  return (
    <section className="py-24 px-4 text-center bg-gradient-to-b from-[#7C3AED]/20 to-transparent">
      <h1 className="text-5xl font-bold mb-4">
        Build the future
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
        Powered by Holy — the vibecoding platform.
      </p>
      <div className="flex gap-3 max-w-sm mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-lg border border-border px-3 py-2 text-sm"
        />
        <button className="rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white">
          Get started
        </button>
      </div>
    </section>
  )
}
`

export function CodePanel() {
  const [code, setCode] = useState(SAMPLE_CODE)

  return (
    <div className="w-[420px] flex-shrink-0 flex flex-col border-r border-border bg-[#0A0A0F]">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
        <span className="text-xs text-muted-foreground ml-2 font-mono">hero-section.tsx</span>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="flex-1 p-4 font-mono text-xs bg-transparent text-[#F8FAFC] outline-none resize-none leading-relaxed"
        spellCheck={false}
      />
    </div>
  )
}
