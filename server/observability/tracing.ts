export function startTrace(name: string) {
  const startedAt = Date.now()
  return {
    name,
    finish(metadata?: Record<string, unknown>) {
      return {
        name,
        durationMs: Date.now() - startedAt,
        metadata: metadata ?? {},
      }
    },
  }
}
