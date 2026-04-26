import { logger } from '@/lib/logger'

type GenerateJob<T> = () => Promise<T>

export async function enqueueGenerateJob<T>(job: GenerateJob<T>): Promise<T> {
  if (process.env.REDIS_URL) {
    logger.warn(
      'REDIS_URL configured but Redis worker adapter is not wired yet; using inline execution',
    )
  } else {
    logger.info('Running generate job inline (REDIS_URL not configured)')
  }

  return job()
}
