import { createId, store, writeAuditEvent } from '@/server/core/in-memory-store'

export async function createImprovementBundle(input: {
  workspaceId?: string
  projectId?: string
  listingId?: string
  title: string
  summary: string
  actions: unknown[]
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}) {
  const now = new Date().toISOString()
  const bundle = {
    id: createId('bundle'),
    workspaceId: input.workspaceId,
    projectId: input.projectId,
    listingId: input.listingId,
    title: input.title,
    summary: input.summary,
    actions: input.actions,
    riskLevel: input.riskLevel ?? 'MEDIUM',
    status: 'PENDING',
    createdAt: now,
    updatedAt: now,
  }

  store.bundles[bundle.id] = bundle
  writeAuditEvent({ category: 'insights', action: 'bundle.created', metadata: { bundleId: bundle.id } })
  return bundle
}

export async function applyImprovementBundle(bundleId: string, actorId: string) {
  const bundle = store.bundles[bundleId] as
    | { status: string; updatedAt: string }
    | undefined
  if (!bundle) throw new Error('Bundle not found')

  bundle.status = 'APPLIED'
  bundle.updatedAt = new Date().toISOString()

  writeAuditEvent({ category: 'insights', action: 'bundle.applied', actorId, metadata: { bundleId } })
  return bundle
}

export async function listImprovementBundles() {
  return Object.values(store.bundles)
}
