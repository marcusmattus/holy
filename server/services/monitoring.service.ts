import type { Prisma } from '@prisma/client'
import { AlertSeverity, AlertType } from '@prisma/client'
import { prisma } from '@/server/db/prisma'

export async function createSystemAlert(input: {
  type: AlertType
  severity: AlertSeverity
  title: string
  message: string
  metadata?: Prisma.InputJsonValue
}) {
  return prisma.systemAlert.create({
    data: input,
  })
}

export async function listSystemAlerts() {
  return prisma.systemAlert.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
}
