import { audit, phase18State } from '@/server/phase18/state'
import { runIntelligencePrivacyReview } from '@/server/intelligence/privacy-review'

export function upsertWorkspaceIntelligencePolicy(workspaceId: string, updates: {
  allowAggregatedLearning?: boolean
  optedOutOfGlobalIntelligence?: boolean
  allowAnonymizedBenchmarking?: boolean
  disablePersonalizedRecommendations?: boolean
  strictModeDefaultsConservative?: boolean
}) {
  const review = runIntelligencePrivacyReview(updates)
  if (!review.approved) throw new Error(review.reason)

  const existing = phase18State.intelligencePolicies.find((item) => item.workspaceId === workspaceId)
  if (existing) {
    Object.assign(existing, updates)
    audit('intelligence.policy.updated', { workspaceId })
    return existing
  }

  const created = {
    workspaceId,
    allowAggregatedLearning: updates.allowAggregatedLearning ?? true,
    optedOutOfGlobalIntelligence: updates.optedOutOfGlobalIntelligence ?? false,
    allowAnonymizedBenchmarking: updates.allowAnonymizedBenchmarking ?? true,
    disablePersonalizedRecommendations: updates.disablePersonalizedRecommendations ?? false,
    strictModeDefaultsConservative: updates.strictModeDefaultsConservative ?? true,
  }

  phase18State.intelligencePolicies.push(created)
  audit('intelligence.policy.created', { workspaceId })
  return created
}

export function getWorkspaceIntelligencePolicy(workspaceId: string) {
  return (
    phase18State.intelligencePolicies.find((item) => item.workspaceId === workspaceId) ?? {
      workspaceId,
      allowAggregatedLearning: true,
      optedOutOfGlobalIntelligence: false,
      allowAnonymizedBenchmarking: true,
      disablePersonalizedRecommendations: false,
      strictModeDefaultsConservative: true,
    }
  )
}
