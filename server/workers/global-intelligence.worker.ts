import { writeAuditEvent } from '@/server/core/in-memory-store'
import { ingestGlobalSignals } from '@/server/intelligence/global-patterns.service'
import type { RawSignal } from '@/server/intelligence/privacy-filter'

export async function runGlobalIntelligenceAggregationJob(signals: RawSignal[]) {
  const aggregated = await ingestGlobalSignals(signals)

  writeAuditEvent({
    category: 'intelligence',
    action: 'aggregation.completed',
    metadata: { outputCount: aggregated.length },
  })

  return {
    status: 'completed',
    outputCount: aggregated.length,
    aggregated,
  }
}
