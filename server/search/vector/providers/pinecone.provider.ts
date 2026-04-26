import { PgvectorProvider } from '@/server/search/vector/providers/pgvector.provider'

export class PineconeProvider extends PgvectorProvider {
  readonly provider = 'pinecone'
}
