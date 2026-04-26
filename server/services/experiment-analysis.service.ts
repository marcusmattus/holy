import { prisma } from '@/server/db'

const MIN_SAMPLE_SIZE = 25

export async function getExperimentResults(experimentId: string) {
  const results = await prisma.experimentResult.findMany({
    where: { experimentId },
    orderBy: { value: 'desc' },
  })

  const hasSufficientSample = results.every((result) => result.sampleSize >= MIN_SAMPLE_SIZE)

  return {
    results,
    recommendation: hasSufficientSample && results[0]
      ? {
          variantKey: results[0].variantKey,
          reason: 'Best current metric with minimum sample threshold met',
          requiresUserApproval: true,
        }
      : {
          variantKey: null,
          reason: 'Insufficient sample size for safe recommendation',
          requiresUserApproval: true,
        },
  }
}
