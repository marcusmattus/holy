import { logger } from '@/lib/logger'

type GenerateJob<T> = () => Promise<T>

export async function enqueueGenerateJob<T>(job: GenerateJob<T>): Promise<T> {
  if (!process.env.REDIS_URL) {
    logger.info('Running generate job inline (REDIS_URL not configured)')
    return job()
  }

  // Redis-backed workers can be wired in here without changing call sites.
  logger.info('REDIS_URL configured; using inline fallback queue runner')
  return job()
}
