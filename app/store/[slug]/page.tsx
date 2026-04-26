import Link from 'next/link'
import { getListingBySlug } from '@/server/services/store.service'

export default async function StoreListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const listing = await getListingBySlug(slug)

  if (!listing) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] p-10 text-white">
        <p>Listing not found.</p>
        <Link href="/store" className="text-[#C9A24A] underline">
          Back to Store
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] p-10 text-white">
      <article className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.03] p-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A24A]">Holy Store</p>
        <h1 className="mt-4 text-4xl font-bold">{listing.title}</h1>
        <p className="mt-4 text-white/60">{listing.description}</p>
        <div className="mt-6 flex gap-3 text-xs uppercase tracking-widest text-white/50">
          <span>{listing.category ?? 'App'}</span>
          <span>•</span>
          <span>{listing.priceType === 'FREE' ? 'Free' : `£${((listing.priceCents ?? 0) / 100).toFixed(2)}`}</span>
          <span>•</span>
          <span>{listing.installs?.length ?? 0} installs</span>
        </div>
      </article>
    </main>
  )
}
