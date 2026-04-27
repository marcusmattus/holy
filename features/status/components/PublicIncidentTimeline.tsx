interface Incident {
  id: string
  title: string
  summary: string
  status: string
  startedAt: string
}

export function PublicIncidentTimeline({ incidents }: { incidents: Incident[] }) {
  if (!incidents.length) {
    return <p className="text-sm text-zinc-400">No public incidents at this time.</p>
  }

  return (
    <div className="space-y-3">
      {incidents.map((incident) => (
        <article key={incident.id} className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
          <h3 className="text-base text-white">{incident.title}</h3>
          <p className="mt-1 text-sm text-zinc-400">{incident.summary}</p>
          <p className="mt-2 text-xs text-[#C9A24A]">{incident.status} · {new Date(incident.startedAt).toLocaleString()}</p>
        </article>
      ))}
    </div>
  )
}
