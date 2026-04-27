const MS_IN_MINUTE = 60_000

export function computeNextRunAt(cron: string, now = new Date()) {
  const maybeMinutes = Number(cron)
  const intervalMinutes = Number.isFinite(maybeMinutes) && maybeMinutes > 0 ? maybeMinutes : 60
  return new Date(now.getTime() + intervalMinutes * MS_IN_MINUTE).toISOString()
}
