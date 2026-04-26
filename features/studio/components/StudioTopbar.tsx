export function StudioTopbar({ status }: { status: string }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-black/40 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C9A24A] text-sm font-bold">H</div>
          <span className="text-lg font-bold tracking-tight">HOLY</span>
        </div>
        <div className="h-4 w-px bg-white/10" />
        <p className="text-xs uppercase tracking-widest text-white/40">
          Studio / <span className="text-white">Runtime</span>
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#C9A24A]">
          {status}
        </div>
        <button className="rounded-full bg-[#C9A24A] px-5 py-2 text-xs font-bold text-black transition hover:brightness-110">
          Deploy
        </button>
      </div>
    </header>
  )
}
