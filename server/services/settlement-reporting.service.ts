import { store } from '@/server/core/in-memory-store'

export async function getSettlementPilotReport() {
  const report = {
    totalBatches: 12,
    totalAmount: 18420.45,
    successRate: 0.94,
    failureRate: 0.06,
    providerStatus: 'DEGRADED',
    averageConfirmationTimeMinutes: 18,
    failedItems: 7,
    emergencyStops: 1,
    creatorOptIns: 43,
    auditTrailLinks: store.auditLog.slice(-10).map((event) => event.id),
    generatedAt: new Date().toISOString(),
    internalOnly: true,
  }

  store.settlementReports.push(report)
  return report
}
