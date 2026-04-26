import { WorkerPoolStatus } from '@prisma/client'
import { prisma } from '@/server/db'

export interface AutoscalingSignals {
  queueDepth: number
  avgJobWaitSeconds: number
  failureRate: number
  cpuPercent?: number
  memoryPercent?: number
  healthyWorkerHeartbeats: number
}

export async function listWorkerPools() {
  return prisma.workerPool.findMany({ include: { autoscaleEvents: true }, orderBy: { updatedAt: 'desc' } })
}

export async function evaluateWorkerPoolScale(poolId: string, signals: AutoscalingSignals) {
  const pool = await prisma.workerPool.findUnique({ where: { id: poolId } })
  if (!pool || pool.status !== WorkerPoolStatus.ACTIVE) {
    return null
  }

  let desired = pool.desiredWorkers
  let reason = 'stable'

  if (signals.failureRate > 0.2 || signals.healthyWorkerHeartbeats <= 0) {
    desired = Math.max(pool.minWorkers, pool.desiredWorkers - 1)
    reason = 'health-degradation'
  } else if (signals.queueDepth > pool.desiredWorkers * 10 || signals.avgJobWaitSeconds > 20) {
    desired = Math.min(pool.maxWorkers, pool.desiredWorkers + 1)
    reason = 'queue-pressure'
  }

  if (signals.cpuPercent && signals.cpuPercent > 90) {
    desired = Math.min(pool.maxWorkers, desired + 1)
    reason = 'cpu-pressure'
  }

  if (desired === pool.desiredWorkers) {
    return { ...pool, scaling: 'no-change' as const }
  }

  const updated = await prisma.workerPool.update({
    where: { id: pool.id },
    data: {
      desiredWorkers: desired,
      lastScaledAt: new Date(),
      autoscaleEvents: {
        create: {
          fromCount: pool.desiredWorkers,
          toCount: desired,
          reason,
          queueDepth: signals.queueDepth,
        },
      },
    },
  })

  return { ...updated, scaling: 'changed' as const, reason }
}
