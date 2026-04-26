import { IncidentDashboard } from '@/features/admin/components/IncidentDashboard'
import { listIncidents } from '@/server/services/incident.service'
import { headers } from 'next/headers'

export default async function AdminIncidentsPage() {
  const requestHeaders = await headers()
  const role = requestHeaders.get('x-user-role') ?? 'member'
  if (role !== 'admin') {
    return <main className="min-h-screen bg-[#0A0A0A] p-6 text-white">Admin access required.</main>
  }

  const incidents = await listIncidents()

  return (
    <main className="min-h-screen bg-[#0A0A0A] p-6 text-white">
      <h1 className="mb-4 text-2xl font-['Space_Grotesk'] text-[#C9A24A]">Incident Command</h1>
      <IncidentDashboard
        incidents={incidents.map((incident) => ({
          id: incident.id,
          title: incident.title,
          severity: incident.severity,
          status: incident.status,
          updates: incident.updates.map((update) => ({
            id: update.id,
            body: update.body,
            createdAt: update.createdAt.toISOString(),
          })),
        }))}
      />
    </main>
  )
}
