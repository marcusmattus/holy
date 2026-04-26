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
  // Mismatched embeddings are treated as non-comparable and return zero similarity.
  if (!a.length || !b.length || a.length !== b.length) {
    return 0
  }
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  const denominator = Math.sqrt(normA) * Math.sqrt(normB)
  if (!denominator) {
    return 0
  }
  return dot / denominator
}
