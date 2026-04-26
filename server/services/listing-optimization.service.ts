import { prisma } from '@/server/db/client'

export async function optimizeListing(listingId: string) {
  const listing = await prisma.storeListing.findUnique({
    where: { id: listingId },
  })

  if (!listing) {
    throw new Error('Listing not found')
  }

  const views = listing.views || 0
  const installs = listing.installs || 0
  const conversionRate = views > 0 ? installs / views : 0

  return {
    improvedTitle: listing.title || `${listing.name} for modern teams`,
    improvedDescription: `${listing.description} Built for quick setup, measurable outcomes, and repeatable growth loops.`,
    suggestedCategory: listing.category || 'Productivity',
    pricingSuggestion:
      typeof listing.price === 'number' && listing.price > 0
        ? `Test £${Math.max(1, Math.round(listing.price * 0.9))} launch pricing for higher trial conversion, then iterate weekly.`
        : 'Start with a low-friction paid tier after proving value via a free install funnel.',
    conversionSuggestions: [
      conversionRate < 0.03
        ? 'Improve the first line of the description to highlight the strongest user outcome.'
        : 'Add social proof near the install CTA to sustain strong conversion.',
      'Use screenshot captions focused on outcomes, not features.',
      'A/B test a shorter title with the primary keyword at the beginning.',
      'Add a clearer pricing explanation on what is included in each tier.',
    ],
  }
}
