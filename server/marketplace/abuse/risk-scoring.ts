export function computeMarketplaceRiskScore(signals: Array<{ score: number }>) {
  if (!signals.length) return 0
  const total = signals.reduce((acc, signal) => acc + signal.score, 0)
  return Number((total / signals.length).toFixed(2))
}
