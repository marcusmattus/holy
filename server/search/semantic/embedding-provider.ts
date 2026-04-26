export interface EmbeddingProvider {
  createEmbedding(input: string): Promise<number[]>
}

export class DeterministicEmbeddingProvider implements EmbeddingProvider {
  async createEmbedding(input: string) {
    const normalized = input.trim().toLowerCase()
    return Array.from({ length: 8 }, (_, index) => (normalized.charCodeAt(index) ?? 0) / 255)
  }
}
