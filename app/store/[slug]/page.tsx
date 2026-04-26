import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/server/db/client'
import { getRelatedListings, getStoreListingBySlug } from '@/server/services/store-listing.service'
import { ListingOptimizationPanel } from '@/features/store/components/ListingOptimizationPanel'
import { logger } from '@/lib/logger'

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ ref?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const listing = await getStoreListingBySlug(slug)

  if (!listing) {
    return { title: 'Listing not found | Holy Store' }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://holy.holysticlabs.com'
  const canonical = `${appUrl}/store/${listing.slug}`

  return {
    title: `${listing.title} | Holy Store`,
    description: listing.description,
    alternates: { canonical },
    openGraph: {
      title: `${listing.title} | Holy Store`,
      description: listing.description,
      url: canonical,
      images: [`${appUrl}/store/${listing.slug}/opengraph-image`],
    },
  }
}

export default async function StoreListingPage({ params, searchParams }: PageProps) {
  const [{ slug }, { ref }] = await Promise.all([params, searchParams])
  const listing = await getStoreListingBySlug(slug)
  if (!listing) notFound()

  await prisma.analyticsEvent
    .create({
      data: {
        eventType: 'LISTING_VIEW',
        eventName: 'STORE_VIEW',
        listingId: listing.id,
        metadata: ref ? { referralCode: ref } : undefined,
      },
    })
    .catch((error) => {
      logger.warn('store_view_analytics_failed', {
        listingId: listing.id,
        error: error instanceof Error ? error.message : 'Unknown analytics error',
      })
    })

  const related = await getRelatedListings(slug)

  const ctaHref =
    listing.price > 0
      ? `/store/${slug}/success?purchase=1${ref ? `&ref=${encodeURIComponent(ref)}` : ''}`
      : `/store/${slug}/success?install=1${ref ? `&ref=${encodeURIComponent(ref)}` : ''}`

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <div className="rounded-2xl border border-white/10 bg-card p-6">
        <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{listing.category}</p>
        <h1 className="mt-2 text-3xl font-bold">{listing.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{listing.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>{listing.installs.toLocaleString()} installs</span>
          <span>{listing.views.toLocaleString()} views</span>
          <span>{(listing.conversionRate * 100).toFixed(1)}% conversion</span>
          {ref ? <span>Referral: {ref}</span> : null}
        </div>
        <Link
          href={ctaHref}
          className="mt-6 inline-flex rounded-lg border border-[#D4AF37]/70 bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black hover:bg-[#E3C35A]"
        >
          {listing.price > 0 ? `Buy for £${listing.price}` : 'Install for free'}
        </Link>
      </div>

      <section className="space-y-3">
        <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Related apps</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <Link
              key={item.id}
              href={`/store/${item.slug}`}
              className="rounded-xl border border-white/10 bg-card p-4 transition-colors hover:border-[#7C3AED]/50"
            >
              <p className="font-semibold">{item.title}</p>
              <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
      <ListingOptimizationPanel slug={slug} />
    </div>
  )
}
