'use client'

export function QaNode({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="min-w-40 rounded-xl border border-[#2A2A2A] bg-[#101010] p-3 text-[#F8FAFC]">
      <p className="text-xs uppercase tracking-wide text-[#C9A24A]">RUN_QA</p>
      <p className="mt-1 text-sm">{String(data.label ?? 'QA Checks')}</p>
    </div>
  )
}
