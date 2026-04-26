'use client'

import { useState } from 'react'

const SAMPLE_CODE = `'use client'

import { useState } from 'react'

export function HeroSection() {
  const [email, setEmail] = useState('')

  return (
    <section className="py-24 px-4 text-center glass-panel">
      <h1 className="text-5xl font-bold mb-4 tracking-tight">
        Build the future
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
        Powered by Holy — the ethereal IDE.
      </p>
      <div className="flex gap-3 max-w-sm mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-2xl border border-border px-4 py-3 text-sm focus:ring-2 focus:ring-[#C9A24A]/50"
        />
        <button className="rounded-2xl bg-[#C9A24A] px-6 py-3 text-sm font-bold text-black gold-glow">
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
    <div className="w-[420px] flex-shrink-0 flex flex-col border-r border-white/5 bg-black/20 backdrop-blur-xl relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#C9A24A]/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/40 backdrop-blur-md relative z-10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
        <span className="text-xs text-white/40 ml-2 font-mono">
          hero-section.tsx
        </span>
        <div className="flex-1" />
        <div className="text-[9px] text-white/20 uppercase tracking-widest">
          AI Generated
        </div>
      </div>
      
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="flex-1 p-4 font-mono text-xs bg-transparent text-white/90 outline-none resize-none leading-relaxed relative z-10"
        style={{
          caretColor: '#C9A24A',
        }}
        spellCheck={false}
      />
      
      {/* Line numbers overlay (optional enhancement) */}
      <div className="absolute left-0 top-16 bottom-0 w-12 bg-black/20 border-r border-white/5 flex flex-col text-[10px] font-mono text-white/20 pt-4 pointer-events-none select-none">
        {code.split('\n').map((_, i) => (
          <div key={i} className="h-[1.4rem] flex items-center justify-end pr-2">
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  )
}
