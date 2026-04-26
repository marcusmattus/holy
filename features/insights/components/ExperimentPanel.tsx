type ExperimentItem = {
  id: string
  name: string
  status: string
  hypothesis: string
}

export function ExperimentPanel({ experiments }: { experiments: ExperimentItem[] }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h2 className="text-lg font-semibold">A/B experiments</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Suggestions first. Launch always requires explicit human approval.
      </p>
      <div className="mt-3 space-y-2">
        {experiments.map((experiment) => (
          <div key={experiment.id} className="rounded-md border border-white/10 p-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-medium">{experiment.name}</h3>
              <span className="rounded-full border border-white/20 px-2 py-1 text-xs">
                {experiment.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{experiment.hypothesis}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
