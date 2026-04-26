export function TransparencyReport({ report }: { report: Record<string, unknown> }) {
  return (
    <pre className="overflow-auto rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 text-xs text-zinc-200">
      {JSON.stringify(report, null, 2)}
    </pre>
  )
}
