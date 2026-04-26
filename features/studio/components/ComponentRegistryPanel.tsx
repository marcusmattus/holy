'use client'

import type { ComponentRegistryItem } from '../types'

export function ComponentRegistryPanel({
  items,
  selectedId,
  onSelect,
}: {
  items: ComponentRegistryItem[]
  selectedId?: string
  onSelect: (item: ComponentRegistryItem) => void
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-white/30">Components</p>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
              selectedId === item.id
                ? 'border-[#C9A24A]/60 bg-[#C9A24A]/10 text-[#C9A24A]'
                : 'border-white/10 bg-black/20 text-white/50 hover:border-white/20 hover:text-white'
            }`}
          >
            <span className="block font-bold">{item.name}</span>
            <span className="mt-1 block text-xs opacity-60">{item.filePath}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
