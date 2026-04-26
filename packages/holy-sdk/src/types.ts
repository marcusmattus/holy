export type SelfHealingRun = {
  id: string
  status: string
  triggerType: string
  riskLevel: string
}

export type OptimizationCampaign = {
  id: string
  name: string
  goal: string
  status: string
}

export type IntelligenceRecommendation = {
  id: string
  title: string
  description: string
  confidence: number
  type: string
}

export type MarketplaceRanking = {
  id: string
  score: number
  publicSignals: { scoreBand: string }
}
