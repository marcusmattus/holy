import { aggregateModelUpdates } from '@/server/federated/model-update-aggregator'

export function runFederatedAggregationRound(updates: Array<{ score: number; sampleSize: number }>, minSampleSize: number) {
  return aggregateModelUpdates(updates, minSampleSize)
}
