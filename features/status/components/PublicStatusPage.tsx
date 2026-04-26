import { PublicIncidentTimeline } from '@/features/status/components/PublicIncidentTimeline'
import { StatusComponentList } from '@/features/status/components/StatusComponentList'

export function PublicStatusPage({
  components,
  incidents,
}: {
  components: Array<{ id: string; name: string; slug: string; status: string; description?: string }>
  incidents: Array<{ id: string; title: string; summary: string; status: string; startedAt: string }>
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h2 className="mb-3 text-xl text-white">Components</h2>
        <StatusComponentList components={components} />
      </div>
      <div>
        <h2 className="mb-3 text-xl text-white">Incidents</h2>
        <PublicIncidentTimeline incidents={incidents} />
      </div>
    </div>
  )
}
