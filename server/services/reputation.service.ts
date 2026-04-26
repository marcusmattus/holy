export function computeStoreRankingScore(input: {
  views: number
  installs: number
  purchases: number
  templateForks: number
  creatorFollowers: number
  revenueCents: number
  referralClicks: number
  recentVelocityBoost?: number
  refundPenalty?: number
}) {
  return (
    input.views * 1 +
    input.installs * 5 +
    input.purchases * 25 +
    input.templateForks * 15 +
    input.creatorFollowers * 4 +
    input.revenueCents / 100 +
    input.referralClicks * 3 +
    (input.recentVelocityBoost ?? 0) -
    (input.refundPenalty ?? 0)
  )
}

export function computeCreatorScore(input: {
  publishedApps: number
  successfulDeployments: number
  templateForks: number
  averageConversionRate: number
  followers: number
}) {
  return (
    input.publishedApps * 10 +
    input.successfulDeployments * 5 +
    input.templateForks * 8 +
    input.averageConversionRate * 100 +
    input.followers * 2
  )
}
