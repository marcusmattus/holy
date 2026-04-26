export function detectMarketplaceSignals(input: {
  installVelocity: number
  reviewPatternScore: number
  duplicateContentScore: number
  reportSpike: number
  refundSpike: number
  referralAbuseScore: number
  rankingSwing: number
}) {
  return [
    { signalType: 'SUSPICIOUS_VELOCITY', score: input.installVelocity },
    { signalType: 'REVIEW_PATTERN', score: input.reviewPatternScore },
    { signalType: 'DUPLICATE_CONTENT', score: input.duplicateContentScore },
    { signalType: 'REPORT_SPIKE', score: input.reportSpike },
    { signalType: 'REFUND_SPIKE', score: input.refundSpike },
    { signalType: 'REFERRAL_ABUSE', score: input.referralAbuseScore },
    { signalType: 'RANKING_MANIPULATION', score: input.rankingSwing },
  ].filter((signal) => signal.score > 0)
}
