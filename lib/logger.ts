type LogLevel = 'info' | 'warn' | 'error'

type LogPayload = Record<string, unknown> | undefined

const SENSITIVE_FIELDS = new Set([
  'token',
  'authorization',
  'secret',
  'password',
  'apiKey',
  'key',
])

function sanitize(payload: LogPayload) {
  if (!payload) return undefined
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => {
      if (SENSITIVE_FIELDS.has(key)) {
        return [key, '[REDACTED]']
      }
      return [key, value]
    }),
  )
}

function log(level: LogLevel, message: string, payload?: LogPayload) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...sanitize(payload),
  }
  const method =
    level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
  method(JSON.stringify(entry))
}

export const logger = {
  info: (message: string, payload?: LogPayload) => log('info', message, payload),
  warn: (message: string, payload?: LogPayload) => log('warn', message, payload),
  error: (message: string, payload?: LogPayload) => log('error', message, payload),
}
