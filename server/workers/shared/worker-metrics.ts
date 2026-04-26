export interface WorkerMetric {
  worker: string
  queue: string
  processed: number
  failed: number
  retries: number
  deadLettered: number
  concurrency: number
}

const workerMetrics = new Map<string, WorkerMetric>()

export function updateWorkerMetric(metric: WorkerMetric) {
  workerMetrics.set(`${metric.worker}:${metric.queue}`, metric)
  return metric
}

export function listWorkerMetrics() {
  return Array.from(workerMetrics.values())
}
