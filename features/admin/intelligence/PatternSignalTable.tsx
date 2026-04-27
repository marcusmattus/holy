export function PatternSignalTable({ signals }: { signals: Array<Record<string, unknown>> }) {
  return (
    <div className="rounded-xl border border-[#C9A24A33] bg-[#0A0A0A]/80 p-4">
      <h3 className="text-[#C9A24A] font-semibold mb-3">Pattern Signals</h3>
      <div className="space-y-2 text-xs text-[#d0d0d0]">
        {signals.map((signal) => (
          <div
            key={String(signal.id)}
            className="flex items-center justify-between border-b border-[#FFFFFF1A] pb-2"
          >
            <span>{String(signal.signalType)}</span>
            <span className="rounded-full border border-[#C9A24A66] px-2 py-0.5">
              {String(
                ((signal.metadata as { valueBand?: string } | undefined)?.valueBand ?? 'N/A'),
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
