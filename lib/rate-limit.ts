type LimitOptions = {
  key: string
  limit: number
  windowMs: number
}

type Bucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

// In-memory limiter for local/single-instance usage.
// For multi-instance production deployments, replace with a shared store (e.g. Redis).
export function checkRateLimit({ key, limit, windowMs }: LimitOptions) {
  const now = Date.now()
  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count += 1
  buckets.set(key, existing)

  return { allowed: true, remaining: limit - existing.count }
}
