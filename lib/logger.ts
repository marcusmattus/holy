type LogLevel = 'info' | 'warn' | 'error'

type LogPayload = {
  event: string
  message: string
  metadata?: Record<string, unknown>
}

const SECRET_KEYS = ['token', 'secret', 'key', 'password', 'authorization']

function sanitizeMetadata(metadata: Record<string, unknown> = {}) {
  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => {
      const isSecret = SECRET_KEYS.some((secretKey) =>
        key.toLowerCase().includes(secretKey),
      )

      return [key, isSecret ? '[REDACTED]' : value]
    }),
  )
}

function log(level: LogLevel, payload: LogPayload) {
  const body = {
    level,
    timestamp: new Date().toISOString(),
    event: payload.event,
    message: payload.message,
    metadata: sanitizeMetadata(payload.metadata),
  }

  if (level === 'error') {
    console.error(JSON.stringify(body))
    return
  }

  console.log(JSON.stringify(body))
}

export const logger = {
  info(payload: LogPayload) {
    log('info', payload)
  },
  warn(payload: LogPayload) {
    log('warn', payload)
  },
  error(payload: LogPayload) {
    log('error', payload)
  },
}
