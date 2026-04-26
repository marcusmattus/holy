'use client'

import { useState } from 'react'
import type { ComponentRegistryItem, HolyFileMap } from '../types'

export function ComponentInspector({
  selected,
  files,
  onPatched,
}: {
  selected: ComponentRegistryItem | null
  files: HolyFileMap
  onPatched: (files: HolyFileMap, summary: string, prompt: string) => void
}) {
  const [instruction, setInstruction] = useState('')
  const [loading, setLoading] = useState(false)

  async function patchComponent() {
    if (!selected || !instruction.trim()) return
    setLoading(true)

    const res = await fetch('/api/ai/patch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instruction: `Edit only the ${selected.name} component. ${instruction}`,
        activeFile: selected.filePath,
        component: selected,
        files,
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (data.files) {
      onPatched(data.files, data.summary ?? `${selected.name} updated`, instruction)
      setInstruction('')
    }
  }

  return (
    <aside className="w-80 border-l border-white/10 bg-black/30 p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A24A]">Inspector</p>
      {selected ? (
        <div className="mt-4 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <h3 className="font-bold text-white">{selected.name}</h3>
            <p className="mt-1 text-xs text-white/40">{selected.filePath}</p>
            {selected.description && <p className="mt-3 text-sm text-white/50">{selected.description}</p>}
          </div>

          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Change this component..."
            className="h-32 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white outline-none focus:border-[#C9A24A]/50"
          />

          <button
            onClick={patchComponent}
            disabled={loading}
            className="w-full rounded-2xl bg-[#C9A24A] px-4 py-3 text-sm font-bold text-black disabled:opacity-50"
          >
            {loading ? 'Editing component…' : 'Patch Component'}
          </button>
        </div>
      ) : (
        <p className="mt-4 text-sm text-white/40">Select a component from the registry to patch only that area.</p>
      )}
    </aside>
  )
}
