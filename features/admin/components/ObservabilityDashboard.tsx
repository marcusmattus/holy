const observabilityRows = [
  'workflow queue depth',
  'failed workflow runs',
  'agent runtime failures',
  'api latency',
  'search latency',
  'deployment failures',
  'stripe webhook failures',
  'settlement pilot attempts',
  'export failures',
]

export function ObservabilityDashboard() {
  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#101010] p-4 text-sm text-white">
      <h2 className="text-[#C9A24A] font-medium">Production observability</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {observabilityRows.map((row) => (
          <li key={row} className="rounded-lg border border-[#262626] p-3">{row}</li>
        ))}
      </ul>
    </div>
  )
}
