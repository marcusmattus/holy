const CONTROLS = [
  'Approval-gated failover and production changes',
  'Tenant-private data remains local in federated workflows',
  'Admin-only settlement exports and reconciliation controls',
  'Enterprise strict mode defaults for high-risk actions',
]

export function SecurityControlsList() {
  return (
    <ul className="space-y-2 text-sm text-zinc-200">
      {CONTROLS.map((control) => (
        <li key={control} className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2">{control}</li>
      ))}
    </ul>
  )
}
