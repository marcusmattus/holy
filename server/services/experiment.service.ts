import { ExperimentStatus, type Prisma } from '@prisma/client'
import { prisma } from '@/server/services/prisma'

export async function createExperiment(input: {
  projectId?: string
  listingId?: string
  name: string
  hypothesis: string
  variants: Record<string, unknown>
}) {
  return prisma.experiment.create({
    data: {
      projectId: input.projectId,
      listingId: input.listingId,
      name: input.name,
      hypothesis: input.hypothesis,
      variants: input.variants as Prisma.InputJsonValue,
    },
  })
}

export async function listExperiments() {
  return prisma.experiment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
}

export async function completeExperiment(input: {
  experimentId: string
  winner: string
  metrics?: Record<string, unknown>
}) {
  return prisma.experiment.update({
    where: { id: input.experimentId },
    data: {
      winner: input.winner,
      metrics: input.metrics as Prisma.InputJsonValue | undefined,
      status: ExperimentStatus.COMPLETED,
    },
  })
}
