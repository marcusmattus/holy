import { prisma } from '@/server/db/client'
import { KpiCard } from './KpiCard'
import { GrowthRecommendations } from './GrowthRecommendations'
import { getProjectGrowthRecommendations } from '@/server/services/growth-recommendation.service'

const REWARD_PER_PURCHASE_CENTS = getEnvNumber('REWARD_PER_PURCHASE_CENTS', 125)
const REVENUE_PER_PURCHASE_CENTS = getEnvNumber('REVENUE_PER_PURCHASE_CENTS', 499)

function getEnvNumber(name: string, fallback: number) {
  const parsed = Number.parseInt(process.env[name] ?? '', 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

export async function CreatorDashboard() {
  const userId = 'demo-user'

  const projects = await prisma.project
    .findMany({
      where: { userId },
      include: {
        deployments: { orderBy: { createdAt: 'desc' }, take: 2 },
        analyticsEvents: true,
      },
    })
    .catch(() => [])

  const topApps = projects
    .map((project) => {
      const views = project.analyticsEvents.filter((e) => e.eventName === 'APP_VIEW').length
      const installs = project.analyticsEvents.filter((e) => e.eventName === 'INSTALL_COMPLETED').length
      const purchases = project.analyticsEvents.filter((e) => e.eventName === 'PURCHASE_COMPLETED').length
      return { project, views, installs, purchases }
    })
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)

  const totals = topApps.reduce(
    (acc, item) => {
      acc.views += item.views
      acc.installs += item.installs
      acc.purchases += item.purchases
      return acc
    },
    { views: 0, installs: 0, purchases: 0 },
  )

  const referralClicks = await prisma.analyticsEvent
    .count({
      where: { userId, eventName: 'REFERRAL_CLICKED' },
    })
    .catch(() => 0)

  const rewardsCents = totals.purchases * REWARD_PER_PURCHASE_CENTS
  const revenueCents = totals.purchases * REVENUE_PER_PURCHASE_CENTS
  const conversionRate = totals.views > 0 ? (totals.installs / totals.views) * 100 : 0
  const recentDeployments = projects.flatMap((project) =>
    project.deployments.map((deployment) => ({
      projectName: project.name,
      deployment,
    })),
  )

  const latestProject = projects[0]
  const insights = latestProject
    ? await getProjectGrowthRecommendations(latestProject.id)
    : { recommendations: [] as string[] }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Creator analytics dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track app growth, deployments, referrals, rewards, and optimization opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Total views" value={totals.views.toLocaleString()} />
        <KpiCard label="Installs" value={totals.installs.toLocaleString()} />
        <KpiCard label="Purchases" value={totals.purchases.toLocaleString()} />
        <KpiCard label="Revenue" value={`$${(revenueCents / 100).toFixed(2)}`} />
        <KpiCard label="Install conversion" value={`${conversionRate.toFixed(2)}%`} />
        <KpiCard label="Referral clicks" value={referralClicks.toLocaleString()} />
        <KpiCard label="Reward balances" value={`$${(rewardsCents / 100).toFixed(2)}`} hint="Estimated pending rewards" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
          <h3 className="text-sm font-semibold">Top apps</h3>
          <div className="mt-3 space-y-2">
            {topApps.length > 0 ? (
              topApps.map(({ project, views, installs, purchases }) => (
                <div
                  key={project.id}
                  className="rounded-lg border border-border/60 bg-background/40 p-3 text-sm flex items-center justify-between"
                >
                  <span>{project.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {views} views • {installs} installs • {purchases} purchases
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No projects yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
          <h3 className="text-sm font-semibold">Recent deployments</h3>
          <div className="mt-3 space-y-2">
            {recentDeployments.length > 0 ? (
              recentDeployments.map(({ projectName, deployment }) => (
                <div
                  key={deployment.id}
                  className="rounded-lg border border-border/60 bg-background/40 p-3 text-sm flex items-center justify-between"
                >
                  <span>{projectName}</span>
                  <span className="text-xs text-muted-foreground">
                    {deployment.status} {deployment.url ? `• ${deployment.url}` : ''}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No deployments yet.</p>
            )}
          </div>
        </div>
      </div>

      <GrowthRecommendations recommendations={insights.recommendations} />
    </div>
  )
}
