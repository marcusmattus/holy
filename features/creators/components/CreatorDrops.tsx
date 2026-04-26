"use client"

export default function CreatorDrops({ drops }: { drops: Array<{ id: string; title: string; date: string }> }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 className="mb-3 text-sm font-semibold text-[#C9A24A]">Recent drops</h3>
      <div className="space-y-2">
        {drops.map((drop) => (
          <div key={drop.id} className="rounded-lg border border-white/10 bg-black/30 p-3 text-xs text-white/80">
            <p>{drop.title}</p>
            <p className="text-white/50">{drop.date}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
