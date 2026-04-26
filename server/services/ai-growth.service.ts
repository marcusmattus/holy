import { GrowthSuggestionType, SuggestionImpact, SuggestionStatus } from '@prisma/client'
import { prisma } from '@/server/db/prisma'
import { generateGrowthSuggestions } from '@/server/agents/growth-agent'
import { buildListingCopySuggestion } from '@/server/agents/listing-agent'
import { buildPricingSuggestion } from '@/server/agents/pricing-agent'

function listingPriceToCents(price: number | null | undefined) {
  // StoreListing.price is stored in major units (e.g. 19.99 GBP), convert to cents for agents.
  return price ? Math.round(price * 100) : 0
}

export async function runGrowthAgents({
  projectId,
  listingId,
}: {
  projectId?: string
  listingId?: string
}) {
  const listing = listingId ? await prisma.storeListing.findUnique({ where: { id: listingId } }) : null
  const baseline = generateGrowthSuggestions({
    conversionRate: 0.02,
    bounceRate: 0.64,
    priceCents: listingPriceToCents(listing?.price),
  })

  const suggestions: Array<Parameters<typeof prisma.growthSuggestion.create>[0]['data']> = baseline.map((item) => ({
    projectId,
    listingId,
    type: item.type as GrowthSuggestionType,
    title: item.title,
    description: item.description,
    impact: SuggestionImpact.MEDIUM,
    status: SuggestionStatus.PENDING,
    metadata: { source: 'growth-agent' },
  }))

  if (listing) {
    const listingSuggestion = buildListingCopySuggestion(listing.description)
    suggestions.push({
      projectId,
      listingId,
      type: GrowthSuggestionType.LISTING_COPY,
      title: listingSuggestion.title,
      description: listingSuggestion.description,
      impact: SuggestionImpact.MEDIUM,
      status: SuggestionStatus.PENDING,
      metadata: { source: 'listing-agent' },
    })
  }

  if (listing?.price) {
    const pricingSuggestion = buildPricingSuggestion(listingPriceToCents(listing.price))
    suggestions.push({
      projectId,
      listingId,
      type: GrowthSuggestionType.PRICING,
      title: pricingSuggestion.title,
      description: pricingSuggestion.description,
      impact: SuggestionImpact.HIGH,
      status: SuggestionStatus.PENDING,
      patchJson: pricingSuggestion.patchJson,
      metadata: { source: 'pricing-agent' },
    })
  }

  if (suggestions.length === 0) return []

  return prisma.$transaction(suggestions.map((suggestion) => prisma.growthSuggestion.create({ data: suggestion })))
}

export async function listGrowthSuggestions(projectId?: string, listingId?: string) {
  return prisma.growthSuggestion.findMany({
    where: {
      ...(projectId ? { projectId } : {}),
      ...(listingId ? { listingId } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function approveGrowthSuggestion(suggestionId: string) {
  return prisma.growthSuggestion.update({
    where: { id: suggestionId },
    data: { status: SuggestionStatus.APPROVED },
  })
}

export async function applyGrowthSuggestion(suggestionId: string) {
  const suggestion = await prisma.growthSuggestion.findUnique({ where: { id: suggestionId } })
  if (!suggestion) throw new Error('Suggestion not found')
  if (suggestion.status !== SuggestionStatus.APPROVED) {
    throw new Error('Suggestion must be approved before applying')
  }

  if (suggestion.patchJson && suggestion.projectId) {
    await prisma.projectVersion.create({
      data: {
        projectId: suggestion.projectId,
        code: JSON.stringify(suggestion.patchJson),
      },
    })
  }

  return prisma.growthSuggestion.update({
    where: { id: suggestionId },
    data: { status: SuggestionStatus.APPLIED },
  })
}
