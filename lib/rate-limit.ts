type RateLimitConfig = {
  key: string
  limit: number
  windowMs: number
}

type Entry = {
  count: number
  resetAt: number
}

const store = new Map<string, Entry>()

export function checkRateLimit({ key, limit, windowMs }: RateLimitConfig) {
  const now = Date.now()
  const existing = store.get(key)

  if (!existing || existing.resetAt <= now) {
    const next = { count: 1, resetAt: now + windowMs }
    store.set(key, next)
    return { success: true, remaining: limit - 1, resetAt: next.resetAt }
  }

  if (existing.count >= limit) {
    return { success: false, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count += 1
  store.set(key, existing)
  return { success: true, remaining: limit - existing.count, resetAt: existing.resetAt }
}

export function getRequestRateLimitKey(req: Request, scope: string) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  return `${scope}:${ip}`
}
