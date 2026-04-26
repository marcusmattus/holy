import { PgvectorProvider } from '@/server/search/vector/providers/pgvector.provider'
import { PineconeProvider } from '@/server/search/vector/providers/pinecone.provider'
import { QdrantProvider } from '@/server/search/vector/providers/qdrant.provider'
import type { VectorProvider } from '@/server/search/vector/vector-provider'

export function getVectorProvider(): VectorProvider {
  const provider = process.env.VECTOR_PROVIDER ?? 'json'

  switch (provider) {
    case 'pgvector':
      return new PgvectorProvider()
    case 'pinecone':
      return new PineconeProvider()
    case 'qdrant':
      return new QdrantProvider()
    case 'json':
    default:
      return new PgvectorProvider()
  }
}
