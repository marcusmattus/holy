interface IncidentTimelineItem {
  id: string
  body: string
  createdAt: string
}

export function IncidentTimeline({ updates }: { updates: IncidentTimelineItem[] }) {
  return (
    <div className="space-y-2">
      {updates.map((update) => (
        <div key={update.id} className="rounded-md border border-white/10 bg-white/[0.03] p-3 text-sm">
          <p>{update.body}</p>
          <p className="mt-1 text-xs opacity-60">{new Date(update.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}
