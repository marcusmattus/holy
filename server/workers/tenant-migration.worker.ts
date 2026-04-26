import { executeTenantMigration } from '@/server/data-region/tenant-migration-executor'

export function runTenantMigrationJob(runId: string) {
  return executeTenantMigration(runId)
}
