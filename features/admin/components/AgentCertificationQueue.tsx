const certificationRows = [
  { id: 'cert-1', agent: 'Enterprise Risk Agent', status: 'PENDING', level: '—' },
  { id: 'cert-2', agent: 'Compliance Auditor Agent', status: 'CERTIFIED', level: 'TRUSTED' },
]

export function AgentCertificationQueue() {
  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#101010] p-4">
      <h2 className="text-sm font-medium text-[#C9A24A]">Agent certification queue</h2>
      <div className="mt-3 space-y-2 text-sm text-white">
        {certificationRows.map((row) => (
          <div key={row.id} className="rounded-lg border border-[#262626] p-3">
            <p>{row.agent}</p>
            <p className="text-xs text-[#BFBFBF]">{row.status} · {row.level}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
