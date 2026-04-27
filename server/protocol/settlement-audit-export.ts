import { runSettlementReconciliation } from '@/server/protocol/settlement-reconciliation'

export function generateSettlementAuditExport(adminApproved: boolean) {
  if (!adminApproved) throw new Error('Admin approval required for settlement audit exports')

  const reconciliation = runSettlementReconciliation()
  return {
    generatedAt: new Date().toISOString(),
    summaries: {
      csv: 'settlement-summary.csv',
      json: 'settlement-summary.json',
    },
    batchProofs: ['batch-proof-001'],
    failedItems: reconciliation.failedItems,
    approvals: ['admin-approved'],
    auditTrailEvent: 'settlement.reconciliation.ran',
  }
}
