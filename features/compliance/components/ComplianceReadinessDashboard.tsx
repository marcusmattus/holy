import { listComplianceControls } from '@/server/services/compliance-readiness.service'

export function ComplianceReadinessDashboard() {
  const controls = listComplianceControls()

  return (
    <section className="space-y-4 rounded-xl border border-[#C9A24A]/30 bg-[#111]/80 p-6 backdrop-blur">
      <h2 className="text-xl font-semibold text-[#F8F2E5]">SOC2 / GDPR Readiness</h2>
      <div className="space-y-2">
        {controls.map((control) => (
          <div key={control.id} className="flex items-center justify-between rounded-lg border border-[#2A2A2A] bg-[#151515] px-3 py-2">
            <div>
              <p className="text-sm text-[#F8F2E5]">{control.title}</p>
              <p className="text-xs text-[#AFAFAF]">{control.framework} · {control.key}</p>
            </div>
            <span className="rounded-full border border-[#C9A24A]/40 px-2 py-1 text-xs text-[#C9A24A]">{control.status}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
