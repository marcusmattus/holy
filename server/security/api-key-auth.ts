import { ApiKeyStatus } from '@prisma/client'
import { createHash, randomBytes } from 'crypto'
import { prisma } from '@/server/db'

const rateWindowMs = 60_000
const maxRequestsPerWindow = 120
const rateLimitByKey = new Map<string, { count: number; resetAt: number }>()

export type AuthenticatedApiKey = {
  userId: string
  workspaceId?: string
  scopes: string[]
  keyId: string
}

export function generateApiKey() {
  const raw = `holy_live_${randomBytes(24).toString('hex')}`
  const prefix = raw.slice(0, 14)
  const keyHash = createHash('sha256').update(raw).digest('hex')
  return { raw, prefix, keyHash }
}

function sha256(input: string) {
  return createHash('sha256').update(input).digest('hex')
}

export async function authenticateApiKey(
  req: Request,
  requiredScopes: string[] = [],
): Promise<AuthenticatedApiKey | null> {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const rawKey = authHeader.slice('Bearer '.length).trim()
  if (!rawKey) return null
  const keyHash = sha256(rawKey)

  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash },
  })
  if (!apiKey) return null
  if (apiKey.status !== ApiKeyStatus.ACTIVE) return null
  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) return null

  const now = Date.now()
  const rateState = rateLimitByKey.get(apiKey.id)
  if (!rateState || now >= rateState.resetAt) {
    rateLimitByKey.set(apiKey.id, { count: 1, resetAt: now + rateWindowMs })
  } else {
    rateState.count += 1
    if (rateState.count > maxRequestsPerWindow) {
      throw new Error('RATE_LIMIT_EXCEEDED')
    }
  }

  if (
    requiredScopes.length > 0 &&
    !requiredScopes.every((scope) => apiKey.scopes.includes(scope))
  ) {
    throw new Error('INSUFFICIENT_SCOPE')
  }

  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  })

  return {
    userId: apiKey.userId,
    workspaceId: apiKey.workspaceId ?? undefined,
    scopes: apiKey.scopes,
    keyId: apiKey.id,
  }
}
