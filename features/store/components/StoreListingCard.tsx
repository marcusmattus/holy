type StoreListingSummary = {
  id: string
  title: string
  slug: string
  description: string
  category: string | null
  priceType: 'FREE' | 'ONE_TIME' | 'SUBSCRIPTION'
  priceCents: number
}

export function StoreListingCard({ listing }: { listing: StoreListingSummary }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#C9A24A]/50 hover:bg-white/[0.05]">
      <div className="mb-6 h-40 rounded-2xl border border-white/10 bg-black/40 p-4">
        <div className="h-3 w-24 rounded-full bg-white/10" />
        <div className="mt-4 h-20 rounded-xl bg-white/[0.04]" />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#C9A24A]">{listing.category ?? 'App'}</p>
      <h3 className="mt-2 text-xl font-bold">{listing.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-white/40">{listing.description}</p>
      <div className="mt-6 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-white/40">
          {listing.priceType === 'FREE' ? 'Free' : `£${((listing.priceCents ?? 0) / 100).toFixed(2)}`}
        </span>
        <a href={`/store/${listing.slug}`} className="rounded-full bg-[#C9A24A] px-4 py-2 text-xs font-bold text-black">
          View App
        </a>
      </div>
    </article>
  )
}
