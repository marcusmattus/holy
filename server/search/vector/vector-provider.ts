export interface VectorRecord {
  id: string
  tenantId: string
  embedding: number[]
  text: string
  metadata?: Record<string, unknown>
  contentHash: string
}

export interface VectorSearchQuery {
  tenantId: string
  queryEmbedding: number[]
  queryText: string
  topK?: number
}

export interface VectorSearchResult {
  id: string
  score: number
  text: string
  metadata?: Record<string, unknown>
}

export interface VectorProvider {
  upsert(record: VectorRecord): Promise<void>
  search(query: VectorSearchQuery): Promise<VectorSearchResult[]>
  removeById(id: string): Promise<void>
}
