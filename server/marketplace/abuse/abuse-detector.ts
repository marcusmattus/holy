import { detectMarketplaceSignals } from '@/server/marketplace/abuse/signals'
import { computeMarketplaceRiskScore } from '@/server/marketplace/abuse/risk-scoring'

export function analyzeMarketplaceTarget(input: {
  installVelocity: number
  reviewPatternScore: number
  duplicateContentScore: number
  reportSpike: number
  refundSpike: number
  referralAbuseScore: number
  rankingSwing: number
}) {
  const signals = detectMarketplaceSignals(input)
  const riskScore = computeMarketplaceRiskScore(signals)
  return {
    signals,
    riskScore,
    proposesEnforcement: riskScore >= 0.7,
  }
}
