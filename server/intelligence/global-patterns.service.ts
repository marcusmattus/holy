import { createId, store, writeAuditEvent } from '@/server/core/in-memory-store'
import { aggregateSignals } from '@/server/intelligence/signal-aggregation'
import type { RawSignal } from '@/server/intelligence/privacy-filter'

const ALLOWED_SIGNAL_TYPES = new Set([
  'CONVERSION_BENCHMARK',
  'TEMPLATE_FORK_VELOCITY',
  'AGENT_SUCCESS_RATE',
  'WORKFLOW_COMPLETION_RATE',
  'PLUGIN_RETENTION',
  'SEARCH_INTENT_CLUSTER',
  'MARKETPLACE_TRUST_SIGNAL',
])

export async function ingestGlobalSignals(signals: RawSignal[]) {
  const allowed = signals.filter((signal) => ALLOWED_SIGNAL_TYPES.has(signal.signalType))
  const aggregated = aggregateSignals(allowed)

  const records = aggregated.map((signal) => ({
    id: createId('gps'),
    ...signal,
    createdAt: new Date().toISOString(),
  }))

  store.intelligenceSignals.push(...records)
  writeAuditEvent({
    category: 'intelligence',
    action: 'signals.ingested',
    metadata: { count: records.length },
  })

  return records
}

export async function listGlobalPatternSignals() {
  return [...store.intelligenceSignals]
}
