'use client'

export function ListingUpdateNode({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="min-w-44 rounded-xl border border-[#2A2A2A] bg-[#101010] p-3 text-[#F8FAFC]">
      <p className="text-xs uppercase tracking-wide text-[#C9A24A]">UPDATE_LISTING</p>
      <p className="mt-1 text-sm">{String(data.label ?? 'Update Listing')}</p>
    </div>
  )
}
