import { listMarketplaceAbuse } from '@/server/services/marketplace-abuse.service'
import { listPublicStatus } from '@/server/services/public-status.service'

export function generateTransparencyReport(approvedForPublish: boolean) {
  const abuse = listMarketplaceAbuse()
  const status = listPublicStatus()

  return {
    approvedForPublish,
    generatedAt: new Date().toISOString(),
    sections: {
      marketplaceModerationActions: abuse.actions.length,
      abuseEnforcementCounts: abuse.signals.length,
      publicUptimeSummary: status.components.map((component) => ({
        name: component.name,
        status: component.status,
      })),
      complianceReadinessStatus: 'INTERNAL_REVIEW',
      settlementPilotStatusSummary: 'PILOT_ONLY_NOT_GLOBALLY_ENABLED',
      securityReportingChannels: ['security@holysticlabs.com'],
      dataResidencyAvailability: ['US_EAST', 'US_WEST', 'EU_CENTRAL', 'AP_SOUTHEAST'],
    },
    aggregateOnly: true,
  }
}
