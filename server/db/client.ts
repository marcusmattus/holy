import { PrismaClient } from '@prisma/client'

declare global {
  var __holyPrisma: PrismaClient | undefined
}

export const prisma =
  globalThis.__holyPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__holyPrisma = prisma
}
