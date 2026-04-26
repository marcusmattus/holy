import { PrismaClient, IdempotencyStatus } from '@prisma/client'

const prisma = new PrismaClient()

export async function reserveIdempotencyKey(key: string, scope: string) {
  const existing = await prisma.idempotencyKey.findUnique({ where: { key } })
  if (existing && existing.status === IdempotencyStatus.COMPLETED) {
    return { isDuplicate: true, response: existing.response }
  }

  if (!existing) {
    await prisma.idempotencyKey.create({
      data: {
        key,
        scope,
        status: IdempotencyStatus.PENDING,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      },
    })
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
