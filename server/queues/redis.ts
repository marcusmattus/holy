export function hasRedisConfigured() {
  return Boolean(process.env.REDIS_URL)
}

export function getRedisConfig() {
  return {
    url: process.env.REDIS_URL ?? 'memory://workflow-queue',
    mode: hasRedisConfigured() ? 'redis' : 'memory',
  }
}
