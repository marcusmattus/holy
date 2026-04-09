import { TrafficChart } from '@/components/analytics/traffic-chart'
import { RealtimeVisitors } from '@/components/analytics/realtime-visitors'
import { TopPagesTable } from '@/components/analytics/top-pages-table'
import { OverviewCards } from '@/components/analytics/overview-cards'

export const metadata = { title: 'Analytics — Holy' }

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track your platform performance
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
    </div>
  )
}
