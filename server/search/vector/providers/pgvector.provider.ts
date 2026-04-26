import type { VectorProvider, VectorRecord, VectorSearchQuery, VectorSearchResult } from '@/server/search/vector/vector-provider'

const records = new Map<string, VectorRecord>()
const MAX_VECTOR_RECORDS = Number(process.env.VECTOR_IN_MEMORY_MAX_RECORDS ?? 20_000)

export class PgvectorProvider implements VectorProvider {
  async upsert(record: VectorRecord): Promise<void> {
    if (records.size >= MAX_VECTOR_RECORDS) {
      const firstKey = records.keys().next().value
      if (firstKey) {
        records.delete(firstKey)
      }
    }
    records.set(`${record.tenantId}:${record.id}`, record)
  }

  async search(query: VectorSearchQuery): Promise<VectorSearchResult[]> {
    return Array.from(records.values())
      .filter((record) => record.tenantId === query.tenantId)
      .map((record) => ({
        id: record.id,
        text: record.text,
        metadata: record.metadata,
        score:
          0.5 * keywordOverlap(query.queryText, record.text) +
          0.5 * normalizedCosineSimilarity(query.queryEmbedding, record.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, query.topK ?? 10)
  }

  async removeById(id: string): Promise<void> {
    Array.from(records.keys())
      .filter((key) => key.endsWith(`:${id}`))
      .forEach((key) => records.delete(key))
  }
}

function keywordOverlap(a: string, b: string) {
  const left = new Set(a.toLowerCase().split(/\W+/).filter(Boolean))
  const right = new Set(b.toLowerCase().split(/\W+/).filter(Boolean))
  let count = 0
  left.forEach((token) => {
    if (right.has(token)) count += 1
  })
  return count / Math.max(1, left.size)
}

function cosineSimilarity(a: number[], b: number[]) {
  const size = Math.min(a.length, b.length)
  if (!size) return 0
  let dot = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < size; i += 1) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  if (!normA || !normB) return 0
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

function normalizedCosineSimilarity(a: number[], b: number[]) {
  return (cosineSimilarity(a, b) + 1) / 2
}
