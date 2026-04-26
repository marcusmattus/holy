import { IncidentTimeline } from '@/features/admin/components/IncidentTimeline'

interface IncidentRecord {
  id: string
  title: string
  severity: string
  status: string
  updates: Array<{ id: string; body: string; createdAt: string }>
}

export function IncidentDashboard({ incidents }: { incidents: IncidentRecord[] }) {
  return (
    <div className="grid gap-4">
      {incidents.map((incident) => (
        <section key={incident.id} className="rounded-xl border border-[#C9A24A33] bg-[#0A0A0A]/90 p-4 font-['Space_Grotesk']">
          <div className="flex items-center justify-between">
            <h3 className="text-lg">{incident.title}</h3>
            <span className="rounded-full border border-white/20 px-2 py-0.5 text-xs">
              {incident.severity} · {incident.status}
            </span>
          </div>
          <div className="mt-3">
            <IncidentTimeline updates={incident.updates} />
          </div>
        </section>
      ))}
    </div>
  )
}
