const TRUST_POSITIVE_WEIGHTS = {
  reviewQuality: 0.3,
  certificationLevel: 0.25,
  complianceStatus: 0.3,
  creatorReputation: 0.15,
} as const

const TRUST_PENALTY_WEIGHTS = {
  refundPenalty: 0.6,
  reportPenalty: 0.4,
} as const
const TRUST_WEIGHT_TOLERANCE = 0.0001

function getValidatedWeights<T extends Record<string, number>>(weights: T): T {
  const total = Object.values(weights).reduce((acc, weight) => acc + weight, 0)
  if (Math.abs(total - 1) <= TRUST_WEIGHT_TOLERANCE) return weights

  return Object.fromEntries(
    Object.entries(weights).map(([key, value]) => [key, value / total]),
  ) as T
}

export function computeTrustScore(input: {
  reviewQuality: number
  certificationLevel: number
  complianceStatus: number
  creatorReputation: number
  refundPenalty: number
  reportPenalty: number
}) {
  const positiveWeights = getValidatedWeights(TRUST_POSITIVE_WEIGHTS)
  const penaltyWeights = getValidatedWeights(TRUST_PENALTY_WEIGHTS)

  const positive =
    input.reviewQuality * positiveWeights.reviewQuality +
    input.certificationLevel * positiveWeights.certificationLevel +
    input.complianceStatus * positiveWeights.complianceStatus +
    input.creatorReputation * positiveWeights.creatorReputation

  const penalty =
    input.refundPenalty * penaltyWeights.refundPenalty +
    input.reportPenalty * penaltyWeights.reportPenalty

  return Math.min(1, Math.max(0, positive - penalty))
}
