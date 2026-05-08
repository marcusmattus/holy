import { TrafficChart } from '@/components/analytics/traffic-chart'
import { RealtimeVisitors } from '@/components/analytics/realtime-visitors'
import { TopPagesTable } from '@/components/analytics/top-pages-table'
import { OverviewCards } from '@/components/analytics/overview-cards'
import { RevenueScenarioPlanner } from '@/components/analytics/revenue-scenario-planner'

export const metadata = { title: 'Holy Insights — Holy' }

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 relative">
      <div className="ethereal-bg" />

      <div>
        <h1 className="text-2xl font-bold">Holy Insights</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Platform analytics, traffic, and revenue modeling
        </p>
      </div>

      <OverviewCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrafficChart />
        </div>
        <RealtimeVisitors />
      </div>

      <TopPagesTable />

      {/* Revenue Scenario Planner — Holy Insights unique feature */}
      <RevenueScenarioPlanner />
    </div>
  )
}
