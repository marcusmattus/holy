export function canSurfaceAsset(input: {
  compliant: boolean
  suspended: boolean
}) {
  return input.compliant && !input.suspended
}

export function redactRankingSignalsForPublic(score: number) {
  return { scoreBand: score >= 0.75 ? 'HIGH' : score >= 0.5 ? 'MEDIUM' : 'LOW' }
}
