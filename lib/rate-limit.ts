// Default policy: max 30 requests per 60-second rolling window per key.
const WINDOW_MS = 60_000
const MAX_REQUESTS = 30
const MAX_BUCKETS_BEFORE_CLEANUP = 1000

const buckets = new Map<string, { count: number; expiresAt: number }>()

export function rateLimit(key: string): { ok: boolean; retryAfterSeconds?: number } {
  const now = Date.now()
  if (buckets.size > MAX_BUCKETS_BEFORE_CLEANUP) {
    for (const [bucketKey, bucket] of buckets.entries()) {
      if (bucket.expiresAt < now) {
        buckets.delete(bucketKey)
      }
    }
  }
  const existing = buckets.get(key)

  if (!existing || existing.expiresAt < now) {
    buckets.set(key, { count: 1, expiresAt: now + WINDOW_MS })
    return { ok: true }
  }

  if (existing.count >= MAX_REQUESTS) {
    return { ok: false, retryAfterSeconds: Math.ceil((existing.expiresAt - now) / 1000) }
  }

  existing.count += 1
  return { ok: true }
}
