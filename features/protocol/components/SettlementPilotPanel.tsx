export function SettlementPilotPanel({
  enabled,
  reason,
}: {
  enabled: boolean
  reason: string
}) {
  return (
    <section className="rounded-xl border border-[#C9A24A]/25 bg-[#0A0A0A]/70 p-4">
      <h2 className="text-lg font-semibold">Settlement pilot</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Pilot is {enabled ? 'enabled' : 'disabled'} by default-safe policy.
      </p>
      <p className="mt-1 text-xs text-[#C9A24A]">{reason}</p>
    </section>
  )
}
