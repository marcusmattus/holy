'use client'

import { useEffect, useState } from 'react'

export function RealtimeVisitors() {
  const [count, setCount] = useState(42)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => Math.max(30, c + Math.floor(Math.random() * 5) - 2))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="font-semibold mb-2">Realtime</h2>
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
        <span className="text-sm text-muted-foreground">Active now</span>
      </div>
      <p className="text-5xl font-bold text-[#10B981]">{count}</p>
      <p className="text-sm text-muted-foreground mt-1">visitors on your apps</p>
      <div className="mt-4 space-y-2">
        {['Holy Commerce', 'Neon Dashboard', 'Analytics Suite'].map((name, i) => (
          <div key={name} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{name}</span>
            <span className="font-medium">{[28, 9, 5][i]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
