"use client"

export default function RealtimeStatusBar({
  connected,
  reconnecting,
  autoSaveLabel,
}: {
  connected: boolean
  reconnecting: boolean
  autoSaveLabel: string
}) {
  const status = connected ? 'Live' : reconnecting ? 'Reconnecting' : 'Offline'
  const dotColor = connected ? 'bg-emerald-400' : reconnecting ? 'bg-amber-400' : 'bg-red-400'

  return (
    <div className="flex items-center justify-between rounded-lg border border-[#C9A24A]/30 bg-white/5 px-3 py-2 text-xs text-white/80">
      <div className="inline-flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dotColor}`} />
        <span>{status}</span>
      </div>
      <span className="text-[#C9A24A]">{autoSaveLabel}</span>
    </div>
  )
}
