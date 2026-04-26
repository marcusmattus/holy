import { auditLog } from '@/server/observability/logger'

export function getActor(headers: Headers) {
  return headers.get('x-holy-actor') ?? 'system'
}

export function requireAdmin(headers: Headers, action: string) {
  const role = headers.get('x-holy-role')
  const actor = getActor(headers)
  if (role !== 'admin') {
    auditLog({ action: `${action}:denied`, actor })
    throw new Error('Forbidden')
  }
  return actor
}
