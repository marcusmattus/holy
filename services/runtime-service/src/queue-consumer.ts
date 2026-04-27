import { executeRuntimeJob } from './runtime-executor'

export interface RuntimeQueueJob {
  id: string
  code: string
}

export interface RuntimeQueueConsumerOptions {
  concurrency?: number
}

const DEFAULT_QUEUE_CONCURRENCY = Number(process.env.RUNTIME_QUEUE_CONCURRENCY ?? 3)

export async function consumeRuntimeQueue(
  jobs: RuntimeQueueJob[],
  options: RuntimeQueueConsumerOptions = {},
) {
  const results = []
  const concurrency = Math.max(1, options.concurrency ?? DEFAULT_QUEUE_CONCURRENCY)

  for (let index = 0; index < jobs.length; index += concurrency) {
    const batch = jobs.slice(index, index + concurrency)
    const batchResults = await Promise.all(
      batch.map((job) => executeRuntimeJob({ code: job.code })),
    )
    results.push(...batchResults)
  }

  return results
}
