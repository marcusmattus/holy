export interface VectorRecord {
  id: string
  embedding: number[]
  metadata: Record<string, unknown>
}

const vectorRecords = new Map<string, VectorRecord>()

export function upsertVectorRecord(record: VectorRecord) {
  vectorRecords.set(record.id, record)
  return record
}

export function searchVectorIndex(queryEmbedding: number[], limit = 10) {
  return Array.from(vectorRecords.values())
    .map((record) => ({
      record,
      score: cosineSimilarity(queryEmbedding, record.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

function cosineSimilarity(a: number[], b: number[]) {
  if (!a.length || !b.length) {
    return 0
  }
  const length = Math.min(a.length, b.length)
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1)
}
