import { createId, store, writeAuditEvent } from '@/server/core/in-memory-store'

const TYPE_MAP: Record<string, string> = {
  CONVERSION_BENCHMARK: 'APP_OPTIMIZATION',
  TEMPLATE_FORK_VELOCITY: 'TEMPLATE_RECOMMENDATION',
  AGENT_SUCCESS_RATE: 'AGENT_RECOMMENDATION',
  WORKFLOW_COMPLETION_RATE: 'WORKFLOW_RECOMMENDATION',
  PLUGIN_RETENTION: 'PLUGIN_RECOMMENDATION',
  SEARCH_INTENT_CLUSTER: 'LISTING_OPTIMIZATION',
  MARKETPLACE_TRUST_SIGNAL: 'DEPLOYMENT_RECOMMENDATION',
}

export async function generateRecommendations(input: {
  workspaceId?: string
  projectId?: string
}) {
  const recommendations = store.intelligenceSignals.slice(-6).map((signal) => {
    const signalType = String(signal.signalType ?? 'CONVERSION_BENCHMARK')
    const metadata = (signal.metadata as Record<string, unknown> | undefined) ?? {}

    return {
      id: createId('rec'),
      workspaceId: input.workspaceId,
      projectId: input.projectId,
      type: TYPE_MAP[signalType] ?? 'APP_OPTIMIZATION',
      title: `Improve ${signalType.toLowerCase().replaceAll('_', ' ')}`,
      description:
        'Recommendation generated from aggregated and anonymized ecosystem patterns.',
      confidence: Number(signal.confidence ?? 0),
      evidence: {
        signalType,
        scope: String(signal.scope ?? 'global'),
        valueBand: metadata.valueBand,
        sampleSize: Number(signal.sampleSize ?? 0),
      },
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  })

  store.intelligenceRecommendations.push(...recommendations)
  writeAuditEvent({
    category: 'intelligence',
    action: 'recommendations.generated',
    metadata: { count: recommendations.length },
  })

  return recommendations
}

export async function listRecommendations(input: { workspaceId?: string; projectId?: string }) {
  return store.intelligenceRecommendations.filter((item) => {
    if (input.workspaceId && item.workspaceId !== input.workspaceId) return false
    if (input.projectId && item.projectId !== input.projectId) return false
    return true
  })
}
