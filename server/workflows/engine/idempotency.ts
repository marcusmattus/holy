import { IdempotencyStatus, Prisma } from '@prisma/client'
import { prisma } from '@/server/db'

export async function reserveIdempotencyKey(key: string, scope: string) {
  const now = new Date()
  const existing = await prisma.idempotencyKey.findUnique({ where: { key } })
  if (existing) {
    if (existing.status === IdempotencyStatus.COMPLETED) {
      return { isDuplicate: true, response: existing.response }
    }
    if (existing.status === IdempotencyStatus.PENDING && existing.expiresAt > now) {
      return { isDuplicate: true, response: { status: 'PENDING' } }
    }

    await prisma.idempotencyKey.update({
      where: { key },
      data: {
        scope,
        status: IdempotencyStatus.PENDING,
        response: Prisma.JsonNull,
        expiresAt: new Date(now.getTime() + 1000 * 60 * 60),
      },
    })
    return { isDuplicate: false }
  }

  try {
    await prisma.idempotencyKey.create({
      data: {
        key,
        scope,
        status: IdempotencyStatus.PENDING,
        expiresAt: new Date(now.getTime() + 1000 * 60 * 60),
      },
    })
  } catch {
    return { isDuplicate: true, response: { status: 'PENDING' } }
  }

  return { isDuplicate: false }
}

export async function completeIdempotencyKey(key: string, response: unknown) {
  await prisma.idempotencyKey.update({
    where: { key },
    data: {
      status: IdempotencyStatus.COMPLETED,
      response: response as object,
    },
  })
}
