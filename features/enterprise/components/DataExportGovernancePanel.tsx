const rows = [
  { id: 'dest-eu', region: 'EU', status: 'APPROVED' },
  { id: 'dest-us', region: 'US', status: 'PENDING' },
]

export function DataExportGovernancePanel() {
  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#111111] p-4 text-sm text-white">
      <h2 className="font-medium text-[#C9A24A]">Data export governance</h2>
      <div className="mt-3 space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="rounded-lg border border-[#303030] p-3">
            <p>{row.region} destination</p>
            <p className="text-xs text-[#CFCFCF]">{row.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
