import { DeterministicEmbeddingProvider } from './embedding-provider'
import { upsertVectorRecord } from './vector-index'

export interface MarketplaceIndexItem {
  id: string
  title: string
  content: string
  isPublic: boolean
  certified: boolean
}

const embeddingProvider = new DeterministicEmbeddingProvider()

export async function indexMarketplaceItems(items: MarketplaceIndexItem[]) {
  const indexed = []
  for (const item of items) {
    if (!item.isPublic) {
      continue
    }

    const embedding = await embeddingProvider.createEmbedding(`${item.title}\n${item.content}`)
    indexed.push(
      upsertVectorRecord({
        id: item.id,
        embedding,
        metadata: {
          title: item.title,
          certified: item.certified,
        },
      }),
    )
  }

  return indexed
}
