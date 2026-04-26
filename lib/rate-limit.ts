const WINDOW_MS = 60_000
const MAX_REQUESTS = 30

const buckets = new Map<string, { count: number; expiresAt: number }>()

export function rateLimit(key: string): { ok: boolean; retryAfterSeconds?: number } {
  const now = Date.now()
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
