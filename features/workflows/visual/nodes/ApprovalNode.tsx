'use client'

export function ApprovalNode({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="min-w-44 rounded-xl border border-[#C9A24A]/60 bg-[#111111] p-3 text-[#F8FAFC]">
      <p className="text-xs uppercase tracking-wide text-[#C9A24A]">APPROVAL_GATE</p>
      <p className="mt-1 text-sm font-semibold">{String(data.label ?? 'Approval Gate')}</p>
      <p className="mt-1 text-xs text-[#A1A1AA]">Required for: {String(data.requiredFor ?? 'High-risk actions')}</p>
    </div>
  )
}
