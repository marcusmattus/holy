export function AgentConfigPanel({
  schema,
  defaultConfig,
}: {
  schema?: unknown
  defaultConfig?: unknown
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 className="text-sm font-medium text-[#C9A24A]">Configuration</h3>
      <pre className="mt-3 overflow-auto rounded-md bg-black/40 p-3 text-xs">
        {JSON.stringify({ schema, defaultConfig }, null, 2)}
      </pre>
    </section>
  )
}
