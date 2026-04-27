const SUBPROCESSORS = [
  { name: 'Cloud Compute Provider', purpose: 'Regional compute and storage', region: 'US/EU/AP' },
  { name: 'Observability Vendor', purpose: 'Platform uptime telemetry', region: 'Global aggregate only' },
]

export function SubprocessorTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <table className="w-full text-left text-sm text-zinc-200">
        <thead className="bg-zinc-950/80 text-zinc-400">
          <tr><th className="px-3 py-2">Subprocessor</th><th className="px-3 py-2">Purpose</th><th className="px-3 py-2">Region</th></tr>
        </thead>
        <tbody>
          {SUBPROCESSORS.map((item) => (
            <tr key={item.name} className="border-t border-zinc-800 bg-black/40">
              <td className="px-3 py-2">{item.name}</td>
              <td className="px-3 py-2">{item.purpose}</td>
              <td className="px-3 py-2">{item.region}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
