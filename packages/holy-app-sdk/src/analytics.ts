const MAX_EVENT_NAME_LENGTH = 64
const MAX_PAYLOAD_SIZE_BYTES = 8_000

export function track(event: string, payload?: Record<string, unknown>) {
  try {
    if (typeof window === 'undefined') {
      return
    }
    if (!event || event.length > MAX_EVENT_NAME_LENGTH) {
      return
    }

    const safePayload = payload ?? {}
    const serialized = JSON.stringify({ event, payload: safePayload })
    if (serialized.length > MAX_PAYLOAD_SIZE_BYTES) {
      return
    }

    navigator.sendBeacon?.(
      '/api/analytics/events',
      new Blob([serialized], { type: 'application/json' })
    )
  } catch {
    // fail silently by design
  }
}
