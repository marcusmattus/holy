import { executeRuntimeJob } from './runtime-executor'

export interface RuntimeQueueJob {
  id: string
  code: string
}

export async function consumeRuntimeQueue(jobs: RuntimeQueueJob[]) {
  const results = []
  for (const job of jobs) {
    results.push(await executeRuntimeJob({ code: job.code }))
  }
  return results
}
