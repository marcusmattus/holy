export async function createTenantMigrationPlan(input: {
  workspaceId: string
  destinationRegion: string
  strictMode?: boolean
  estimatedDataGb?: number
  includeSettlementData?: boolean
}) {
  if (input.includeSettlementData) {
    throw new Error('Settlement/payment records require explicit compliance flag before migration.')
  }

  return {
    workspaceId: input.workspaceId,
    destinationRegion: input.destinationRegion,
    estimatedDataGb: input.estimatedDataGb ?? 0,
    destinationAvailable: true,
    requiresAdminApproval: true,
    requiresOwnerApproval: Boolean(input.strictMode),
    dryRunSupported: true,
    generatedAt: new Date().toISOString(),
  }
}
