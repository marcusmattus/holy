import { createHash } from 'node:crypto'
import { prisma } from '@/server/db'

const UINT32_BUCKET_SIZE = 0x100000000

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
  const totalWeight = variants.reduce((sum, variant) => sum + variant.weight, 0)
  if (Math.abs(totalWeight - 1) > 0.000001) {
    throw new Error('Experiment variant weights must sum to 1.0')
  }

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
  const bucket = Number.parseInt(hash.slice(0, 8), 16) / UINT32_BUCKET_SIZE

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
