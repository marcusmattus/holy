import { indexMarketplaceItems } from '@/server/search/semantic/marketplace-indexer'

export async function POST() {
  const indexed = await indexMarketplaceItems([
    {
      id: 'listing-template-starter',
      title: 'Starter Template',
      content: 'Production-ready starter template with analytics and auth',
      isPublic: true,
      certified: true,
    },
  ])

  return Response.json({ indexedCount: indexed.length })
}
