const levels = ['Low', 'Medium', 'High', 'Critical']

export function ComplianceRiskMatrix() {
  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#111111] p-4">
      <h3 className="text-sm font-medium text-[#C9A24A]">Risk matrix</h3>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-white">
        {levels.map((level) => (
          <div key={level} className="rounded-lg border border-[#303030] px-3 py-2">
            {level}
          </div>
        ))}
      </div>
    </div>
  )
}
