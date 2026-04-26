import { createHash } from 'node:crypto'
import { prisma } from '@/server/db'

export async function assignExperimentVariant(input: {
  experimentId: string
  sessionId: string
}) {
  const experiment = await prisma.experiment.findUnique({
    where: { id: input.experimentId },
  })
  if (!experiment) throw new Error('Experiment not found')

  const variants = (experiment.variants as Array<{ key: string; weight: number }>) ?? []
  if (variants.length === 0) throw new Error('Experiment has no variants configured')

  const existing = await prisma.experimentExposure.findUnique({
    where: {
      experimentId_sessionId: {
        experimentId: input.experimentId,
        sessionId: input.sessionId,
      },
    },
  })

  if (existing) {
    return existing
  }

  const hash = createHash('sha256').update(`${input.experimentId}:${input.sessionId}`).digest('hex')
  const bucket = Number.parseInt(hash.slice(0, 8), 16) / 0xffffffff

  let cumulative = 0
  let assigned = variants[0].key
  for (const variant of variants) {
    cumulative += variant.weight
    if (bucket <= cumulative) {
      assigned = variant.key
      break
    }
  }

  return prisma.experimentExposure.create({
    data: {
      experimentId: input.experimentId,
      sessionId: input.sessionId,
      variantKey: assigned,
    },
  })
}
