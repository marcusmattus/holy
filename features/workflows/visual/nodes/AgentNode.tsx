'use client'

export function AgentNode({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="min-w-44 rounded-xl border border-[#C9A24A]/40 bg-[#0A0A0A]/90 p-3 text-[#F8FAFC] shadow-[0_0_24px_rgba(201,162,74,0.12)]">
      <p className="text-xs uppercase tracking-wide text-[#C9A24A]">RUN_AGENT</p>
      <p className="mt-1 text-sm font-semibold">{String(data.label ?? 'Agent')}</p>
      <p className="mt-1 text-xs text-[#A1A1AA]">Action: {String(data.action ?? 'READ_ANALYTICS')}</p>
    </div>
  )
}
