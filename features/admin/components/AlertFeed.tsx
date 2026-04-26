"use client"

type SystemAlert = {
  id: string
  severity: string
  title: string
  message: string
  status: string
}

export default function AlertFeed({ alerts }: { alerts: SystemAlert[] }) {
  return (
    <div className="rounded-xl border border-[#C9A24A]/25 bg-white/5 p-4">
      <h3 className="mb-3 text-sm font-semibold text-[#C9A24A]">Production alerts</h3>
      <div className="space-y-2">
        {alerts.length === 0 ? (
          <p className="text-xs text-white/50">No active alerts</p>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="rounded-lg border border-white/10 bg-black/30 p-3 text-xs text-white/85">
              <div className="flex items-center justify-between">
                <p className="font-medium">{alert.title}</p>
                <span className="text-[#C9A24A]">{alert.severity}</span>
              </div>
              <p className="mt-1 text-white/70">{alert.message}</p>
              <p className="mt-1 text-[11px] uppercase tracking-wide text-white/50">{alert.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
