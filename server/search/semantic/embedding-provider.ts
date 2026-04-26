export interface EmbeddingProvider {
  createEmbedding(input: string): Promise<number[]>
}

export class DeterministicEmbeddingProvider implements EmbeddingProvider {
  async createEmbedding(input: string) {
    const normalized = input.trim().toLowerCase()
    const vectorLength = 16
    const values = Array.from({ length: vectorLength }, () => 0)

    for (let index = 0; index < normalized.length; index++) {
      const slot = index % vectorLength
      values[slot] = (values[slot] + normalized.charCodeAt(index) * (slot + 1)) % 1024
    }

    return values.map((value) => value / 1024)
  }
}
