'use client'

import { useState } from 'react'
import type { HolyFileMap } from '../types'

export function AiPatchPanel({
  files,
  onPatched,
}: {
  files: HolyFileMap
  onPatched: (files: HolyFileMap, summary: string) => void
}) {
  const [instruction, setInstruction] = useState('')
  const [loading, setLoading] = useState(false)

  async function patch() {
    if (!instruction.trim()) return
    setLoading(true)

    const res = await fetch('/api/ai/patch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instruction, files }),
    })

    const data = await res.json()
    setLoading(false)

    if (data.files) {
      onPatched(data.files, data.summary ?? 'Patch applied')
      setInstruction('')
    }
  }

  return (
    <div className="flex h-full flex-col border-r border-white/10 bg-black/30">
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A24A]">Holy AI</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">Patch the app</h2>
          <p className="mt-2 text-sm text-white/40">Ask for targeted file edits, UI changes, new components, or bug fixes.</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-white/30">Suggested edits</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Add auth screen', 'Make it mobile-first', 'Add pricing cards', 'Add dashboard sidebar'].map((chip) => (
              <button
                key={chip}
                onClick={() => setInstruction(chip)}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/50 transition hover:border-[#C9A24A]/50 hover:text-[#C9A24A]"
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/50 p-4">
        <textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="Tell Holy what to change..."
          className="h-28 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white placeholder:text-white/20 outline-none transition focus:border-[#C9A24A]/50"
        />
        <button
          onClick={patch}
          disabled={loading}
          className="mt-3 w-full rounded-2xl bg-[#C9A24A] px-4 py-3 text-sm font-bold text-black transition hover:brightness-110 disabled:opacity-50"
        >
          {loading ? 'Patching files…' : 'Apply AI Patch'}
        </button>
      </div>
    </div>
  )
}
