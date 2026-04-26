import {
  executeTenantMigration,
  finalizeTenantMigration,
} from '@/server/data-region/tenant-migration-executor'

export async function runTenantMigrationJob(runId: string) {
  try {
    await executeTenantMigration(runId)
    return finalizeTenantMigration(runId, true)
  } catch (error) {
    return finalizeTenantMigration(runId, false, (error as Error).message)
  }
}
