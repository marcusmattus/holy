import { prisma } from '@/server/db/client'
import { getProjectAnalyticsSummary } from './analytics.service'

const MIN_VIEWS_FOR_CTA_RECOMMENDATION = 100
const MIN_INSTALL_CONVERSION = 0.05
const MIN_INSTALLS_FOR_PRICING_RECOMMENDATION = 20
const MIN_PURCHASE_PER_INSTALL = 0.05
const MIN_REFERRAL_CLICKS = 5
const MIN_PATCHES_FOR_DEPLOYMENT_PROMPT = 10

export async function getProjectGrowthRecommendations(projectId: string) {
  const [summary, referralClicks, deployments] = await Promise.all([
    getProjectAnalyticsSummary(projectId).catch(() => ({
      views: 0,
      installs: 0,
      purchases: 0,
      patches: 0,
      installConversionRate: 0,
      purchaseConversionRate: 0,
    })),
    prisma.analyticsEvent
      .count({
        where: {
          projectId,
          eventName: 'REFERRAL_CLICKED',
        },
      })
      .catch(() => 0),
    prisma.deployment.count({ where: { projectId } }).catch(() => 0),
  ])

  const recommendations: string[] = []

  if (
    summary.views > MIN_VIEWS_FOR_CTA_RECOMMENDATION &&
    summary.installConversionRate < MIN_INSTALL_CONVERSION
  ) {
    recommendations.push('Improve your listing hero and install CTA to lift install conversion.')
  }

  const purchasePerInstall = summary.installs > 0 ? summary.purchases / summary.installs : 0
  if (
    summary.installs > MIN_INSTALLS_FOR_PRICING_RECOMMENDATION &&
    purchasePerInstall < MIN_PURCHASE_PER_INSTALL
  ) {
    recommendations.push('Test pricing changes or add a free tier to improve buyer activation.')
  }

  if (referralClicks < MIN_REFERRAL_CLICKS) {
    recommendations.push('Launch a referral campaign and share your listing link in your channels.')
  }

  if (summary.patches > MIN_PATCHES_FOR_DEPLOYMENT_PROMPT && deployments === 0) {
    recommendations.push('Ship a preview deployment so users can try your latest AI-improved build.')
  }

  return {
    projectId,
    recommendations,
    metrics: {
      ...summary,
      referralClicks,
      deployments,
    },
  }
}
