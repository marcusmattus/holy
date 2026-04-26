"use client"

export default function CreatorReputationCard({
  reputationScore,
  publicStats,
}: {
  reputationScore: number
  publicStats: { templates: number; apps: number; followers: number }
}) {
  return (
    <div className="rounded-xl border border-[#C9A24A]/25 bg-white/5 p-4">
      <h3 className="text-sm font-semibold text-[#C9A24A]">Creator reputation</h3>
      <p className="mt-2 text-3xl font-bold text-white">{reputationScore}</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-white/70">
        <div className="rounded-md border border-white/10 p-2">Templates: {publicStats.templates}</div>
        <div className="rounded-md border border-white/10 p-2">Apps: {publicStats.apps}</div>
        <div className="rounded-md border border-white/10 p-2">Followers: {publicStats.followers}</div>
      </div>
    </div>
  )
}
