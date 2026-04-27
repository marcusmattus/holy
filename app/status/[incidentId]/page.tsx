import { notFound } from 'next/navigation'
import { listPublicStatus } from '@/server/services/public-status.service'

export default async function IncidentPage({ params }: { params: Promise<{ incidentId: string }> }) {
  const { incidentId } = await params
  const incident = listPublicStatus().incidents.find((item) => item.id === incidentId)
  if (!incident) notFound()

  return (
    <main className="min-h-screen bg-[#0A0A0A] p-8 text-white">
      <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6">
        <h1 className="text-2xl text-[#C9A24A]">{incident.title}</h1>
        <p className="mt-2 text-sm text-zinc-300">{incident.summary}</p>
        <p className="mt-3 text-xs text-zinc-500">Status: {incident.status}</p>
      </div>
    </main>
  )
}
