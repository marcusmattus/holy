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
    value = crypto.randomUUID()
    window.localStorage.setItem(key, value)
  }
  return value
}
