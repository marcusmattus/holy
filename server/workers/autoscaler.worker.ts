import { evaluateWorkerPoolScale } from '@/server/services/worker-autoscaler.service'

export async function runAutoscalerWorker(poolId: string) {
  return evaluateWorkerPoolScale(poolId, {
    queueDepth: 0,
    avgJobWaitSeconds: 0,
    failureRate: 0,
    healthyWorkerHeartbeats: 1,
  })
}
