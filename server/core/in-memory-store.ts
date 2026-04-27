export type AuditEvent = {
  id: string
  action: string
  category: string
  actorId?: string
  metadata?: Record<string, unknown>
  createdAt: string
}

type Store = {
  selfHealingRuns: Record<string, unknown>
  optimizationCampaigns: Record<string, unknown>
  optimizationRuns: Record<string, unknown>
  intelligenceSignals: Array<Record<string, unknown>>
  intelligenceRecommendations: Array<Record<string, unknown>>
  incidents: Record<string, unknown>
  postmortems: Record<string, unknown>
  bundles: Record<string, unknown>
  migrations: Record<string, unknown>
  settlementReports: Array<Record<string, unknown>>
  auditLog: AuditEvent[]
}

function createStore(): Store {
  return {
    selfHealingRuns: {},
    optimizationCampaigns: {},
    optimizationRuns: {},
    intelligenceSignals: [],
    intelligenceRecommendations: [],
    incidents: {},
    postmortems: {},
    bundles: {},
    migrations: {},
    settlementReports: [],
    auditLog: [],
  }
}

const globalStore = globalThis as typeof globalThis & { __holyPhase17Store?: Store }

export const store = globalStore.__holyPhase17Store ?? createStore()
if (!globalStore.__holyPhase17Store) {
  globalStore.__holyPhase17Store = store
}

export function createId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function writeAuditEvent(event: Omit<AuditEvent, 'id' | 'createdAt'>) {
  const auditEvent: AuditEvent = {
    id: createId('audit'),
    createdAt: new Date().toISOString(),
    ...event,
  }
  store.auditLog.push(auditEvent)
  return auditEvent
}
