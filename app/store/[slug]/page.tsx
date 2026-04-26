import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/server/db/client'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic'

type ListingData = {
  id: string
  title: string
  description: string
  slug: string
  category: string
  installs: number
  views: number
  price: number
  exists: boolean
}

async function getListingBySlug(slug: string): Promise<ListingData> {
  const listing = await prisma.storeListing.findFirst({
    where: {
      OR: [{ slug }, { name: slug }],
    },
  })

  if (!listing) {
    return {
      id: slug,
      title: slug.replace(/-/g, ' ').replace(/\b\w/g, (value) => value.toUpperCase()),
      description: 'Creator app listing on Holy Store.',
      slug,
      category: 'Productivity',
      installs: 0,
      views: 0,
      price: 0,
      exists: false,
    }
  }

  return {
    id: listing.id,
    title: listing.title || listing.name,
    description: listing.description,
    slug: listing.slug || slug,
    category: listing.category || 'Productivity',
    installs: listing.installs,
    views: listing.views,
    price: listing.price || 0,
    exists: true,
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params
  const listing = await getListingBySlug(slug)

  const appUrl = env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const canonical = `${appUrl}/store/${listing.slug}`

  return {
    title: `${listing.title} | Holy Store`,
    description: listing.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${listing.title} | Holy Store`,
      description: listing.description,
      url: canonical,
      images: [`${canonical}/opengraph-image`],
    },
  }
}

export default async function StoreListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ ref?: string }>
}) {
  const { slug } = await params
  const { ref } = await searchParams
  const listing = await getListingBySlug(slug)

  try {
    await prisma.analyticsEvent.upsert({
      where: {
        idempotencyKey: `listing-view:${listing.id}:${ref ?? 'none'}`,
      },
      create: {
        listingId: listing.exists ? listing.id : undefined,
        eventType: ref ? 'REFERRAL' : 'VIEW',
        referralCode: ref,
        idempotencyKey: `listing-view:${listing.id}:${ref ?? 'none'}`,
      },
      update: {},
    })
  } catch {
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{listing.category}</p>
        <h1 className="text-3xl font-semibold mt-2">{listing.title}</h1>
        <p className="mt-3 text-muted-foreground">{listing.description}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Views {listing.views} · Installs {listing.installs}
          {ref ? ` · Referral ${ref}` : ''}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/store/${listing.slug}/success?listingId=${listing.id}${ref ? `&ref=${encodeURIComponent(ref)}` : ''}`}
            className="rounded-lg border border-[#EAB308]/60 bg-[#EAB308]/20 px-4 py-2 text-sm font-semibold text-[#FDE68A] hover:bg-[#EAB308]/30"
          >
            {listing.price > 0 ? `Buy £${listing.price.toFixed(2)}` : 'Install app'}
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">Related apps</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Creator CRM', 'Growth Dashboard'].map((related) => (
            <div key={related} className="rounded-xl border border-white/10 p-4">
              <p className="font-medium">{related}</p>
              <p className="text-sm text-muted-foreground mt-1">Recommended for teams building conversion loops.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
