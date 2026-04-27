export function RecommendationQualityPanel({
  recommendations,
}: {
  recommendations: Array<Record<string, unknown>>
}) {
  const avgConfidence =
    recommendations.length === 0
      ? 0
      : recommendations.reduce((acc, item) => acc + Number(item.confidence ?? 0), 0) /
        recommendations.length

  return (
    <div className="rounded-xl border border-[#C9A24A33] bg-[#0A0A0A]/80 p-4">
      <h3 className="text-[#C9A24A] font-semibold">Recommendation Quality</h3>
      <p className="mt-2 text-xs text-[#d0d0d0]">Total recommendations: {recommendations.length}</p>
      <p className="text-xs text-[#d0d0d0]">Average confidence: {(avgConfidence * 100).toFixed(1)}%</p>
      <p className="text-xs text-[#d0d0d0]">Privacy filters: active</p>
    </div>
  )
}
