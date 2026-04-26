const timeline = ['Review requested', 'QA completed', 'Compliance approved']

export function ComplianceAuditTimeline() {
  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#111111] p-4 text-sm text-white">
      <h3 className="font-medium text-[#C9A24A]">Audit timeline</h3>
      <ul className="mt-3 space-y-2 text-xs text-[#CFCFCF]">
        {timeline.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  )
}
