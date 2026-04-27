import { createId } from '@/server/core/in-memory-store'

export async function runTenantMigration(input: {
  workspaceId: string
  destinationRegion: string
  approvedById: string
  dryRun?: boolean
}) {
  return {
    id: createId('migration'),
    workspaceId: input.workspaceId,
    destinationRegion: input.destinationRegion,
    dryRun: Boolean(input.dryRun),
    status: input.dryRun ? 'DRY_RUN_COMPLETED' : 'MIGRATION_COMPLETED',
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    approvedById: input.approvedById,
  }
}
