'use client'

interface ProcurementQueueItem {
  id: string
  assetType: string
  amountCents: number
  status: string
}

export function ProcurementQueue({ items }: { items: ProcurementQueueItem[] }) {
  return (
    <div className="rounded-xl border border-[#C9A24A33] bg-[#0A0A0A]/90 p-4 font-['Space_Grotesk']">
      <h3 className="text-[#C9A24A] text-sm uppercase tracking-widest">Procurement Queue</h3>
      <div className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-md border border-white/10 px-3 py-2">
            <span>{item.assetType}</span>
            <span>£{(item.amountCents / 100).toFixed(2)}</span>
            <span className="rounded-full border border-white/20 px-2 py-0.5 text-xs">{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
