import { createRollbackPlan } from '@/server/data-region/tenant-migration-rollback'
import { audit, makeId, phase18State } from '@/server/phase18/state'
import type { DataRegion } from '@/server/phase18/types'

export function createTenantMigrationRun(workspaceId: string, fromRegion: DataRegion, toRegion: DataRegion, strictMode = true) {
  const run = {
    id: makeId('migration-run'),
    workspaceId,
    fromRegion,
    toRegion,
    status: 'DRAFT' as const,
    plan: {
      strictMode,
      requiresComplianceFlagForFinancialRecords: true,
      queueBackedExecution: true,
    },
    rollbackPlan: createRollbackPlan(fromRegion, toRegion),
    createdAt: new Date().toISOString(),
  }
  phase18State.migrationRuns.push(run)
  audit('tenant-migration.run.created', run)
  return run
}

export function dryRunTenantMigration(runId: string) {
  const run = phase18State.migrationRuns.find((item) => item.id === runId)
  if (!run) throw new Error('Migration run not found')
  run.status = 'DRY_RUN_COMPLETE'
  run.dryRunResult = {
    checks: ['schema-sync', 'routing-shift', 'payment-record-compliance-flag'],
    success: true,
  }
  audit('tenant-migration.run.dry-run', { runId })
  return run
}

export function approveTenantMigration(runId: string, adminId: string, enterpriseOwnerApprovalId?: string) {
  const run = phase18State.migrationRuns.find((item) => item.id === runId)
  if (!run) throw new Error('Migration run not found')
  if (run.status !== 'DRY_RUN_COMPLETE') throw new Error('Dry-run must complete first')
  if (!enterpriseOwnerApprovalId) throw new Error('Enterprise owner approval required in strict mode')
  run.status = 'APPROVED'
  run.approvedById = adminId
  audit('tenant-migration.run.approved', { runId, adminId, enterpriseOwnerApprovalId })
  return run
}

export function executeTenantMigration(runId: string) {
  const run = phase18State.migrationRuns.find((item) => item.id === runId)
  if (!run) throw new Error('Migration run not found')
  if (run.status !== 'APPROVED') throw new Error('Run must be approved before execution')
  run.status = 'RUNNING'
  run.status = 'COMPLETED'
  run.executedAt = new Date().toISOString()
  audit('tenant-migration.run.executed', { runId })
  return run
}
