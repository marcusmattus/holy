import { store, writeAuditEvent } from '@/server/core/in-memory-store'
import { createTenantMigrationPlan } from '@/server/data-region/tenant-migration-planner'
import { runTenantMigration } from '@/server/data-region/tenant-migration-runner'

export async function planTenantMigration(input: {
  workspaceId: string
  destinationRegion: string
  strictMode?: boolean
  estimatedDataGb?: number
  includeSettlementData?: boolean
}) {
  const plan = await createTenantMigrationPlan(input)
  writeAuditEvent({ category: 'data-region', action: 'migration.plan.created', metadata: plan })
  return plan
}

export async function executeTenantMigration(input: {
  workspaceId: string
  destinationRegion: string
  approvedById: string
  dryRun?: boolean
}) {
  const migration = await runTenantMigration(input)
  store.migrations[migration.id] = migration
  writeAuditEvent({
    category: 'data-region',
    action: 'migration.executed',
    actorId: input.approvedById,
    metadata: migration,
  })
  return migration
}
