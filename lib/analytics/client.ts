export async function trackClientEvent(input: {
  projectId?: string
  listingId?: string
  eventName: string
  metadata?: Record<string, unknown>
}) {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...input,
        source: typeof window !== 'undefined' ? window.location.href : undefined,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
        sessionId: getSessionId(),
      }),
    })
  } catch {
    // analytics should never break UX
  }
}

function getSessionId() {
  if (typeof window === 'undefined') return undefined

  const key = 'holy_session_id'
  let value = window.localStorage.getItem(key)
  if (!value) {
    value =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `fallback_${fallbackRandomSegment()}`
    window.localStorage.setItem(key, value)
  }
  return value
}

function fallbackRandomSegment() {
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    const bytes = new Uint8Array(8)
    crypto.getRandomValues(bytes)
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  }
  return Math.random().toString(36).slice(2)
}
