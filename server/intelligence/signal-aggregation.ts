import { bucketizeMetric } from '@/server/intelligence/anonymization'
import { privacyFilter, type RawSignal } from '@/server/intelligence/privacy-filter'

export function aggregateSignals(signals: RawSignal[]) {
  return signals
    .map((signal) => privacyFilter(signal))
    .filter((signal): signal is NonNullable<typeof signal> => Boolean(signal))
    .map((signal) => ({
      ...signal,
      metadata: {
        ...signal.metadata,
        valueBand: bucketizeMetric(signal.value),
      },
    }))
}
