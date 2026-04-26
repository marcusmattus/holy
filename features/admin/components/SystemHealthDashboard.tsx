type Metric = {
  label: string
  value: string
}

const METRICS: Metric[] = [
  { label: 'AI generations / day', value: '1,284' },
  { label: 'Failed deployments', value: '7' },
  { label: 'Stripe webhook failures', value: '1' },
  { label: 'Payout failures', value: '0' },
  { label: 'Active users', value: '4,921' },
  { label: 'Store purchases', value: '312' },
  { label: 'Template forks', value: '488' },
  { label: 'Collaboration sessions', value: '173' },
]

export default function SystemHealthDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {METRICS.map((metric) => (
        <div key={metric.label} className="rounded-xl border border-[#C9A24A]/30 bg-white/5 p-4 backdrop-blur">
          <p className="text-[10px] uppercase tracking-wider text-[#C9A24A]">{metric.label}</p>
          <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
        </div>
      ))}
    </div>
  )
}
