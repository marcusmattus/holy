import { addDifferentialPrivacyNoise } from '@/server/federated/differential-privacy'

export function aggregateModelUpdates(updates: Array<{ score: number; sampleSize: number }>, minSampleSize: number) {
  const accepted = updates.filter((update) => update.sampleSize >= minSampleSize)
  if (!accepted.length) {
    return { aggregatedScore: 0, acceptedCount: 0 }
  }
  const weighted = accepted.reduce((acc, update) => acc + update.score * update.sampleSize, 0)
  const totalSamples = accepted.reduce((acc, update) => acc + update.sampleSize, 0)
  return {
    aggregatedScore: addDifferentialPrivacyNoise(weighted / totalSamples),
    acceptedCount: accepted.length,
  }
}
