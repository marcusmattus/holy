import crypto from 'crypto'
import { prisma } from '@/server/services/prisma'

export type ApiPlan = 'FREE_API' | 'PRO_API' | 'TEAM_API' | 'ENTERPRISE_API'

const API_LIMITS: Record<ApiPlan, number> = {
  FREE_API: 1000,
  PRO_API: 25_000,
  TEAM_API: 100_000,
  ENTERPRISE_API: 500_000,
}

export function hashApiKey(rawKey: string) {
  return crypto.createHash('sha256').update(rawKey).digest('hex')
}

export async function enforceApiKeyAndRateLimit(input: {
  apiKey: string
  requiredScope: string
  plan?: ApiPlan
}) {
  const hashed = hashApiKey(input.apiKey)
  const apiKey = await prisma.apiKey.findUnique({
    where: { hashedKey: hashed },
    select: { id: true, scopes: true, workspaceId: true, userId: true },
  })
  if (!apiKey) throw new Error('Invalid API key')
  if (!apiKey.scopes.includes(input.requiredScope)) {
    throw new Error('API key scope denied')
  }

  const now = new Date()
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const nextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))
  const limit = API_LIMITS[input.plan ?? 'FREE_API']

  const bucket = await prisma.apiUsageBucket.upsert({
    where: {
      id: `${apiKey.id}:${monthStart.toISOString()}`,
    },
    update: {},
    create: {
      id: `${apiKey.id}:${monthStart.toISOString()}`,
      workspaceId: apiKey.workspaceId,
      userId: apiKey.userId ?? undefined,
      apiKeyId: apiKey.id,
      windowStart: monthStart,
      windowEnd: nextMonth,
      limit,
      count: 0,
    },
  })

  const incremented = await prisma.apiUsageBucket.updateMany({
    where: { id: bucket.id, count: { lt: bucket.limit } },
    data: {
      count: { increment: 1 },
    },
  })
  if (incremented.count === 0) {
    throw new Error('Rate limit exceeded')
  }
  const updated = await prisma.apiUsageBucket.findUniqueOrThrow({
    where: { id: bucket.id },
  })

  await prisma.analyticsEvent.create({
    data: {
      workspaceId: apiKey.workspaceId ?? undefined,
      event: 'api_request',
      metadata: {
        scope: input.requiredScope,
        count: updated.count,
        limit: updated.limit,
      },
    },
  })

  return {
    workspaceId: apiKey.workspaceId ?? undefined,
    remaining: Math.max(0, updated.limit - updated.count),
  }
}
