import { PatternSignalTable } from '@/features/admin/intelligence/PatternSignalTable'
import { RecommendationQualityPanel } from '@/features/admin/intelligence/RecommendationQualityPanel'

type Props = {
  signals: Array<Record<string, unknown>>
  recommendations: Array<Record<string, unknown>>
}

export function GlobalIntelligenceDashboard({ signals, recommendations }: Props) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="rounded-2xl border border-[#C9A24A33] bg-[radial-gradient(circle_at_top,_#C9A24A22,_#0A0A0A)] p-6">
          <h1 className="text-2xl font-semibold text-[#C9A24A]">Global Intelligence Dashboard</h1>
          <p className="text-sm text-[#d2d2d2] mt-2">
            Platform patterns, recommendation outcomes, and privacy-safe intelligence status.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <PatternSignalTable signals={signals} />
          <RecommendationQualityPanel recommendations={recommendations} />
        </div>
      </div>
    </div>
  )
}
