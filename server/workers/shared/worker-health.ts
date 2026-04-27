export type WorkerStatus = 'starting' | 'healthy' | 'degraded' | 'stopped'

export interface WorkerHealth {
  worker: string
  status: WorkerStatus
  heartbeatAt: string
}

const healthMap = new Map<string, WorkerHealth>()

export function recordWorkerHeartbeat(worker: string, status: WorkerStatus = 'healthy') {
  const health: WorkerHealth = {
    worker,
    status,
    heartbeatAt: new Date().toISOString(),
  }
  healthMap.set(worker, health)
  return health
}

export function listWorkerHealth() {
  return Array.from(healthMap.values())
}
