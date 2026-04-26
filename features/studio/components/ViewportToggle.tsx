export function ViewportToggle() {
  return (
    <div className="flex rounded-lg border border-white/10 bg-white/[0.04] p-1 text-[10px] font-bold uppercase tracking-widest">
      <button className="rounded-md bg-white/10 px-3 py-1 text-white">Code</button>
      <button className="rounded-md px-3 py-1 text-white/40">Desktop</button>
      <button className="rounded-md px-3 py-1 text-white/40">Mobile</button>
    </div>
  )
}
