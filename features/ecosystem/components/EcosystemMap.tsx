export function EcosystemMap() {
  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[radial-gradient(circle_at_top,#2b2210,transparent_45%),#0A0A0A] p-6">
      <h2 className="text-xl font-semibold text-[#F8FAFC]">Holy Ecosystem Map</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {[
          'Agents & Orchestrations',
          'Workflow Templates',
          'Enterprise Connectors',
          'Integrations Marketplace',
          'Exports & Warehouses',
          'Creator Monetization',
        ].map((item) => (
          <div key={item} className="rounded-lg border border-[#3A3A3A] bg-[#101010] p-3 text-sm text-[#A1A1AA]">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
