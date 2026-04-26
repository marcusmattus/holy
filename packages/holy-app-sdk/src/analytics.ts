export function track(event: string, payload?: Record<string, unknown>) {
  try {
    if (typeof window === 'undefined') {
      return
    }

    navigator.sendBeacon?.('/api/analytics/events', JSON.stringify({ event, payload }))
  } catch {
    // fail silently by design
  }
}
