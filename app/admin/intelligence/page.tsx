import { GlobalIntelligenceDashboard } from '@/features/admin/intelligence/GlobalIntelligenceDashboard'
import { listGlobalPatternSignals } from '@/server/intelligence/global-patterns.service'
import { listRecommendations } from '@/server/intelligence/recommendation-engine'

export default async function AdminIntelligencePage() {
  const [signals, recommendations] = await Promise.all([
    listGlobalPatternSignals(),
    listRecommendations({}),
  ])

  return <GlobalIntelligenceDashboard signals={signals} recommendations={recommendations} />
}
