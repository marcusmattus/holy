import Link from 'next/link'
import { getRankedListings } from '@/server/services/store-ranking.service'

export const metadata = { title: 'Store — Holy' }
export const dynamic = 'force-dynamic'

export default async function StorePage() {
  const listings = await getRankedListings()

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Holy Store</h1>
        <p className="text-sm text-muted-foreground mt-1">Ranked by app growth and conversion.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings.map((listing) => (
          <Link
            key={listing.id}
            href={`/store/${listing.slug}`}
            className="rounded-xl border border-border bg-card p-4 hover:border-[#7C3AED]/50 transition-colors"
          >
            <h2 className="font-semibold">{listing.name}</h2>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{listing.description}</p>
            <div className="text-xs text-muted-foreground mt-3">
              score {listing.stats.score.toFixed(2)} • {listing.stats.views} views • {listing.stats.installs} installs
            </div>
          </Link>
        ))}
        {listings.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            No published listings yet.
          </div>
        ) : null}
      </div>
    </div>
  )
}
