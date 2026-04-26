import { prisma } from '@/server/db/client'

const FALLBACK_LISTINGS = [
  {
    id: 'fallback-analytics-pro',
    slug: 'analytics-pro',
    name: 'Analytics Pro',
    description: 'Advanced analytics dashboard with real-time insights and funnels.',
    category: 'Analytics',
    price: 29,
    installs: 2340,
    views: 12840,
  },
  {
    id: 'fallback-commerce-kit',
    slug: 'commerce-kit',
    name: 'Commerce Kit',
    description: 'Launch ecommerce products with checkout, catalog, and inventory.',
    category: 'Commerce',
    price: 49,
    installs: 1820,
    views: 10780,
  },
  {
    id: 'fallback-auth-module',
    slug: 'auth-module',
    name: 'Auth Module',
    description: 'Authentication starter with social login and permissions.',
    category: 'Security',
    price: 19,
    installs: 4100,
    views: 19300,
  },
] as const

export type StoreListingView = {
  id: string
  slug: string
  title: string
  description: string
  category: string
  price: number
  installs: number
  views: number
  conversionRate: number
}

export async function getStoreListingBySlug(slug: string): Promise<StoreListingView | null> {
  try {
    const listing = await prisma.storeListing.findUnique({
      where: { slug },
      include: {
        analytics: true,
      },
    })

    if (!listing) return getFallbackListing(slug)

    const installs = listing.analytics.reduce((sum, item) => sum + item.installs, 0)
    const views = listing.analytics.reduce((sum, item) => sum + item.views, 0)
    const conversionRate = views > 0 ? installs / views : 0

    return {
      id: listing.id,
      slug: listing.slug,
      title: listing.name,
      description: listing.description,
      category: listing.category,
      price: listing.price ?? 0,
      installs,
      views,
      conversionRate,
    }
  } catch {
    return getFallbackListing(slug)
  }
}

export async function getStoreListingByIdentifier(
  listingIdOrSlug: string,
): Promise<StoreListingView | null> {
  const bySlug = await getStoreListingBySlug(listingIdOrSlug)
  if (bySlug) return bySlug

  try {
    const listing = await prisma.storeListing.findUnique({
      where: { id: listingIdOrSlug },
      include: { analytics: true },
    })
    if (!listing) return null
    const installs = listing.analytics.reduce((sum, item) => sum + item.installs, 0)
    const views = listing.analytics.reduce((sum, item) => sum + item.views, 0)
    return {
      id: listing.id,
      slug: listing.slug,
      title: listing.name,
      description: listing.description,
      category: listing.category,
      price: listing.price ?? 0,
      installs,
      views,
      conversionRate: views > 0 ? installs / views : 0,
    }
  } catch {
    return null
  }
}

function getFallbackListing(slug: string): StoreListingView | null {
  const listing = FALLBACK_LISTINGS.find((item) => item.slug === slug)
  if (!listing) return null
  return {
    id: listing.id,
    slug: listing.slug,
    title: listing.name,
    description: listing.description,
    category: listing.category,
    price: listing.price,
    installs: listing.installs,
    views: listing.views,
    conversionRate: listing.installs / listing.views,
  }
}

export async function getRelatedListings(slug: string): Promise<StoreListingView[]> {
  const fallback = FALLBACK_LISTINGS.filter((item) => item.slug !== slug).map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.name,
    description: item.description,
    category: item.category,
    price: item.price,
    installs: item.installs,
    views: item.views,
    conversionRate: item.installs / item.views,
  }))

  try {
    const listing = await prisma.storeListing.findUnique({ where: { slug } })
    if (!listing) return fallback

    const related = await prisma.storeListing.findMany({
      where: {
        category: listing.category,
        slug: { not: slug },
        isPublished: true,
      },
      take: 3,
      include: { analytics: true },
    })

    if (related.length === 0) return fallback

    return related.map((item) => {
      const installs = item.analytics.reduce((sum, row) => sum + row.installs, 0)
      const views = item.analytics.reduce((sum, row) => sum + row.views, 0)
      return {
        id: item.id,
        slug: item.slug,
        title: item.name,
        description: item.description,
        category: item.category,
        price: item.price ?? 0,
        installs,
        views,
        conversionRate: views > 0 ? installs / views : 0,
      }
    })
  } catch {
    return fallback
  }
}
