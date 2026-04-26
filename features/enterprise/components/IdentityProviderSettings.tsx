export function IdentityProviderSettings({
  workspaceId,
  provider,
  status,
}: {
  workspaceId: string
  provider: string
  status: string
}) {
  return (
    <section className="rounded-xl border border-[#C9A24A]/25 bg-[#0A0A0A]/70 p-4">
      <h2 className="text-lg font-semibold">Identity Provider</h2>
      <p className="mt-2 text-sm text-muted-foreground">Workspace: {workspaceId}</p>
      <div className="mt-3 flex gap-2 text-xs">
        <span className="rounded-full border border-white/20 px-2 py-1">{provider}</span>
        <span className="rounded-full border border-[#C9A24A]/30 px-2 py-1 text-[#C9A24A]">
          {status}
        </span>
      </div>
    </section>
  )
}
