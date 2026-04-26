import { PgvectorProvider } from '@/server/search/vector/providers/pgvector.provider'

export class QdrantProvider extends PgvectorProvider {
  readonly provider = 'qdrant'
}
