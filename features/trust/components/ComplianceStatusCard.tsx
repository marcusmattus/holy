export function ComplianceStatusCard({ name, status }: { name: string; status: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
      <p className="text-sm text-zinc-400">{name}</p>
      <p className="mt-1 text-base font-medium text-[#C9A24A]">{status}</p>
    </div>
  )
}
