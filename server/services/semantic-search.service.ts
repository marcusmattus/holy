import { DeterministicEmbeddingProvider } from '@/server/search/semantic/embedding-provider'
import { searchVectorIndex } from '@/server/search/semantic/vector-index'

const provider = new DeterministicEmbeddingProvider()

export async function semanticMarketplaceSearch(query: string) {
  const embedding = await provider.createEmbedding(query)
  return searchVectorIndex(embedding).map((result) => ({
    id: result.record.id,
    score: result.score,
    metadata: result.record.metadata,
  }))
}
