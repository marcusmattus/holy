export interface RegionHealth {
  region: string
  status: string
  priority: number
  lastHealthCheckAt?: string
}

export interface FederatedRound {
  id: string
  name: string
  status: string
  target: string
}

export interface OptimizationSchedule {
  id: string
  campaignId: string
  cron: string
  enabled: boolean
}

export interface MarketplaceAbuseSignal {
  id: string
  targetType: string
  targetId: string
  signalType: string
  score: number
}

export interface StatusComponent {
  id: string
  name: string
  slug: string
  status: string
}

export interface TransparencyReportResponse {
  approvedForPublish: boolean
  generatedAt: string
  sections: Record<string, unknown>
}
