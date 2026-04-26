type SlaMetric = {
  id: string
  metric: string
  value: number
  unit: string
}

export function SlaDashboard({ metrics }: { metrics: SlaMetric[] }) {
  return (
    <section className="rounded-xl border border-[#C9A24A]/25 bg-[#0A0A0A]/70 p-4">
      <h2 className="text-lg font-semibold">Enterprise SLA dashboard</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.id} className="rounded-md border border-white/15 bg-white/5 p-3">
            <p className="text-xs text-muted-foreground">{metric.metric}</p>
            <p className="mt-1 text-xl font-semibold">
              {metric.value} {metric.unit}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
