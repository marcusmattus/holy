import { canSurfaceAsset, redactRankingSignalsForPublic } from '@/server/marketplace/ranking/personalization-policy'
import { computeTrustScore } from '@/server/marketplace/ranking/trust-score'
import { computeVelocityScore } from '@/server/marketplace/ranking/velocity-score'

export type RankingAsset = {
  id: string
  semanticRelevance: number
  compliant: boolean
  suspended: boolean
  reviewQuality: number
  certificationLevel: number
  creatorReputation: number
  refundPenalty: number
  reportPenalty: number
  installVelocity: number
  forkVelocity: number
  purchaseVelocity: number
  workflowSuccessRate: number
  pluginRetention: number
}

export function rankMarketplaceAssets(assets: RankingAsset[]) {
  return assets
    .filter((asset) => canSurfaceAsset({ compliant: asset.compliant, suspended: asset.suspended }))
    .map((asset) => {
      const trust = computeTrustScore({
        reviewQuality: asset.reviewQuality,
        certificationLevel: asset.certificationLevel,
        complianceStatus: asset.compliant ? 1 : 0,
        creatorReputation: asset.creatorReputation,
        refundPenalty: asset.refundPenalty,
        reportPenalty: asset.reportPenalty,
      })

      const velocity = computeVelocityScore({
        installVelocity: asset.installVelocity,
        forkVelocity: asset.forkVelocity,
        purchaseVelocity: asset.purchaseVelocity,
        workflowSuccessRate: asset.workflowSuccessRate,
        pluginRetention: asset.pluginRetention,
      })

      const score = asset.semanticRelevance * 0.4 + trust * 0.35 + velocity * 0.25
      return {
        id: asset.id,
        score,
        publicSignals: redactRankingSignalsForPublic(score),
      }
    })
    .sort((a, b) => b.score - a.score)
}
