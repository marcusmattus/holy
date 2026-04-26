import type { MarketplaceSearchItem, SearchProvider } from '@/server/search/search-provider'
import { prisma } from '@/server/db'

const staticAssets: MarketplaceSearchItem[] = [
  {
    id: 'template-enterprise-onboarding',
    type: 'Template',
    title: 'Enterprise Onboarding Template',
    description: 'Compliance-first onboarding flow',
    score: 68,
    isPublic: true,
  },
  {
    id: 'workflow-approval-gate',
    type: 'WorkflowTemplate',
    title: 'Approval Gate Workflow',
    description: 'Pause and resume gated workflow runs',
    score: 74,
    isPublic: true,
  },
]

function rank(term: string, item: MarketplaceSearchItem) {
  const haystack = `${item.title} ${item.description}`.toLowerCase()
  const relevance = haystack.includes(term) ? 50 : 0
  return item.score + relevance + (item.isCertified ? 20 : 0)
}

export class PostgresSearchProvider implements SearchProvider {
  async searchMarketplace(query: string, filters?: { type?: MarketplaceSearchItem['type'] }) {
    const term = query.toLowerCase().trim()
    const listings = await prisma.storeListing.findMany({ where: { isPublished: true }, take: 20 })

    const mappedListings: MarketplaceSearchItem[] = listings.map((listing) => ({
      id: listing.id,
      type: 'StoreListing',
      title: listing.name,
      description: listing.description,
      score: 40,
      isPublic: listing.isPublished,
      isCertified: false,
    }))

    return [...mappedListings, ...staticAssets]
      .filter((item) => item.isPublic)
      .filter((item) => (filters?.type ? item.type === filters.type : true))
      .filter((item) => (term ? `${item.title} ${item.description}`.toLowerCase().includes(term) : true))
      .sort((a, b) => rank(term, b) - rank(term, a))
  }
}
