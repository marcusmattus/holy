import {
  Prisma,
  RuntimeNodeStatus,
  type DataRegion,
  type RuntimeProvider,
} from '@prisma/client'
import { prisma } from '@/server/db'

const HEARTBEAT_SECRET = process.env.RUNTIME_HEARTBEAT_SECRET ?? 'dev-heartbeat-secret'

export async function listRuntimeClusterNodes() {
  return prisma.runtimeClusterNode.findMany({ orderBy: { updatedAt: 'desc' } })
}

export async function upsertRuntimeHeartbeat(input: {
  provider: RuntimeProvider
  region: DataRegion
  endpoint: string
  capacity?: number
  activeJobs?: number
  metadata?: Record<string, unknown>
  token: string
}) {
  if (process.env.NODE_ENV === 'production' && HEARTBEAT_SECRET === 'dev-heartbeat-secret') {
    throw new Error('RUNTIME_HEARTBEAT_SECRET must be configured in production')
  }

  if (input.token !== HEARTBEAT_SECRET) {
    throw new Error('Invalid heartbeat token')
  }

  return prisma.runtimeClusterNode.upsert({
    where: { endpoint: input.endpoint },
    update: {
      provider: input.provider,
      region: input.region,
      capacity: input.capacity ?? 1,
      activeJobs: input.activeJobs ?? 0,
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
      status: RuntimeNodeStatus.HEALTHY,
      lastHeartbeatAt: new Date(),
    },
    create: {
      provider: input.provider,
      region: input.region,
      endpoint: input.endpoint,
      capacity: input.capacity ?? 1,
      activeJobs: input.activeJobs ?? 0,
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
      status: RuntimeNodeStatus.HEALTHY,
      lastHeartbeatAt: new Date(),
    },
  })
}
