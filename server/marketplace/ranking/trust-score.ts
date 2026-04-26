export function computeTrustScore(input: {
  reviewQuality: number
  certificationLevel: number
  complianceStatus: number
  creatorReputation: number
  refundPenalty: number
  reportPenalty: number
}) {
  const positive =
    input.reviewQuality * 0.3 +
    input.certificationLevel * 0.25 +
    input.complianceStatus * 0.3 +
    input.creatorReputation * 0.15

  const penalty = input.refundPenalty * 0.6 + input.reportPenalty * 0.4
  return Math.max(0, positive - penalty)
}
