export function runIntelligencePrivacyReview(payload: Record<string, unknown>) {
  const allowedKeys = new Set([
    'allowAggregatedLearning',
    'optedOutOfGlobalIntelligence',
    'allowAnonymizedBenchmarking',
    'disablePersonalizedRecommendations',
    'strictModeDefaultsConservative',
  ])
  const payloadKeys = Object.keys(payload)
  const hasOnlyAllowedKeys = payloadKeys.every((key) => allowedKeys.has(key))
  const hasValidBooleanValues = payloadKeys.every(
    (key) =>
      typeof payload[key] === 'boolean' ||
      typeof payload[key] === 'undefined' ||
      payload[key] === null,
  )
  const hasNoNulls = payloadKeys.every((key) => payload[key] !== null)
  const approved = hasOnlyAllowedKeys && hasValidBooleanValues && hasNoNulls

  return {
    approved,
    reason: approved
      ? 'Payload passed policy-schema privacy checks'
      : 'Payload failed policy-schema validation; only known boolean policy keys are allowed',
  }
}
