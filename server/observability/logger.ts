export type AuditLogEvent = {
  action: string
  actor: string
  resource?: string
  metadata?: Record<string, unknown>
  createdAt: string
}

const auditEvents: AuditLogEvent[] = []

export function logger(scope: string, message: string, metadata?: Record<string, unknown>) {
  const entry = { scope, message, metadata, createdAt: new Date().toISOString() }
  if (process.env.NODE_ENV !== 'test') {
    console.info('[holy]', JSON.stringify(entry))
  }
  return entry
}

export function auditLog(event: Omit<AuditLogEvent, 'createdAt'>) {
  const entry: AuditLogEvent = { ...event, createdAt: new Date().toISOString() }
  auditEvents.push(entry)
  logger('audit', event.action, { actor: event.actor, resource: event.resource })
  return entry
}

export function listAuditLogs() {
  return [...auditEvents]
}
