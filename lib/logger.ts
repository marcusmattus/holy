type Meta = Record<string, unknown> | undefined

function write(level: 'info' | 'warn' | 'error', message: string, meta?: Meta) {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(meta ? { meta } : {}),
  }

  if (level === 'error') {
    console.error(payload)
    return
  }

  if (level === 'warn') {
    console.warn(payload)
    return
  }

  console.log(payload)
}

export const logger = {
  info(message: string, meta?: Meta) {
    write('info', message, meta)
  },
  warn(message: string, meta?: Meta) {
    write('warn', message, meta)
  },
  error(message: string, meta?: Meta) {
    write('error', message, meta)
  },
}
