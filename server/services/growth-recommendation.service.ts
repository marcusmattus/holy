import { prisma } from '@/server/db/client'
import { getProjectAnalyticsSummary } from './analytics.service'

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

  if (summary.views > 100 && summary.installConversionRate < 0.05) {
    recommendations.push('Improve your listing hero and install CTA to lift install conversion.')
  }

  const purchasePerInstall = summary.installs > 0 ? summary.purchases / summary.installs : 0
  if (summary.installs > 20 && purchasePerInstall < 0.05) {
    recommendations.push('Test pricing changes or add a free tier to improve buyer activation.')
  }

  if (referralClicks < 5) {
    recommendations.push('Launch a referral campaign and share your listing link in your channels.')
  }

  if (summary.patches > 10 && deployments === 0) {
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
