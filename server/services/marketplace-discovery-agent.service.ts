import { getVectorProvider } from '@/server/search/vector/vector-provider-factory'

export type MarketplaceAssetType = 'app' | 'template' | 'agent' | 'workflow' | 'plugin' | 'integration'

export interface MarketplaceAskInput {
  tenantId: string
  question: string
  assetType?: MarketplaceAssetType
}

export async function askMarketplaceDiscovery(input: MarketplaceAskInput) {
  const provider = getVectorProvider()
  const results = await provider.search({
    tenantId: input.tenantId,
    queryText: input.question,
    queryEmbedding: fakeEmbedding(input.question),
    topK: 5,
  })

  const filtered = input.assetType
    ? results.filter((result) => String(result.metadata?.assetType ?? '').toLowerCase() === input.assetType)
    : results

  return {
    query: input.question,
    recommendations: filtered.map((result) => ({
      id: result.id,
      title: result.text.slice(0, 80),
      why: `Matched semantic intent and keywords with score ${result.score.toFixed(2)}`,
      paid: Boolean(result.metadata?.paid),
      certified: Boolean(result.metadata?.certified),
      trusted: Boolean(result.metadata?.trusted),
    })),
    bundleSuggestion: {
      app: filtered[0]?.id ?? null,
      template: filtered[1]?.id ?? null,
      agent: filtered[2]?.id ?? null,
      workflow: filtered[3]?.id ?? null,
    },
    disclaimer: 'Recommendations do not guarantee revenue or business outcomes.',
  }
}

function fakeEmbedding(input: string): number[] {
  return input
    .slice(0, 32)
    .split('')
    .map((char) => char.charCodeAt(0) / 255)
}
