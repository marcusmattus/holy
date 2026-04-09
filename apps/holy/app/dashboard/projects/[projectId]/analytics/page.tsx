import { TrafficChart } from '@/components/analytics/traffic-chart'
import { TopPagesTable } from '@/components/analytics/top-pages-table'
import Link from 'next/link'

export default function ProjectAnalyticsPage({ params }: { params: { projectId: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard/projects" className="hover:text-foreground">Projects</Link>
        <span>/</span>
        <Link href={`/dashboard/projects/${params.projectId}`} className="hover:text-foreground">Project</Link>
        <span>/</span>
        <span className="text-foreground">Analytics</span>
      </div>
      <h1 className="text-2xl font-bold">Project Analytics</h1>
      <TrafficChart />
      <TopPagesTable />
    </div>
  )
}
