'use client'

type VersionItem = {
  id: string
  label: string | null
  prompt: string | null
  createdAt: string
}

export function VersionTimeline({
  versions,
  onRestore,
}: {
  versions: VersionItem[]
  onRestore: (versionId: string) => void
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-white/30">Project History</p>
        <span className="rounded-full border border-[#C9A24A]/30 bg-[#C9A24A]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#C9A24A]">
          Live Build
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {versions.map((version) => (
          <article key={version.id} className="rounded-2xl border border-white/10 bg-black/30 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-white">{version.label ?? 'Version'}</p>
              <button
                onClick={() => onRestore(version.id)}
                className="rounded-full border border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/70 hover:border-[#C9A24A]/60 hover:text-[#C9A24A]"
              >
                Restore
              </button>
            </div>
            {version.prompt && <p className="mt-2 line-clamp-2 text-xs text-white/50">{version.prompt}</p>}
            <p className="mt-2 text-[11px] text-white/40">{new Date(version.createdAt).toLocaleString()}</p>
          </article>
        ))}
        {versions.length === 0 && <p className="text-sm text-white/40">No versions yet.</p>}
      </div>
    </div>
  )
}
