'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

const CATEGORIES = ['All', 'Analytics', 'Commerce', 'Auth', 'Content', 'Productivity', 'Business']

export function SearchFilters() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search apps..."
          className="w-full rounded-lg border border-border bg-background pl-8 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
        />
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              category === cat
                ? 'bg-[#7C3AED] text-white'
                : 'border border-border hover:bg-muted'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}
