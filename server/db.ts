import { PrismaClient } from '@prisma/client'

declare global {
  var __holyPrisma: PrismaClient | undefined
}

export const prisma = global.__holyPrisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.__holyPrisma = prisma
}
