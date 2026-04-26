import type {
  IntelligenceRecommendation,
  MarketplaceRanking,
  OptimizationCampaign,
  SelfHealingRun,
} from './types'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init)
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }
  return (await res.json()) as T
}

export const holy = {
  selfHealing: {
    runs: {
      list: () => request<{ runs: SelfHealingRun[] }>('/api/admin/self-healing/runs'),
    },
  },
  optimization: {
    campaigns: {
      create: (body: Record<string, unknown>) =>
        request<{ campaign: OptimizationCampaign }>('/api/optimization/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }),
      run: (campaignId: string, body?: Record<string, unknown>) =>
        request(`/api/optimization/campaigns/${campaignId}/run`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body ?? {}),
        }),
    },
  },
  intelligence: {
    recommendations: {
      list: () =>
        request<{ recommendations: IntelligenceRecommendation[] }>(
          '/api/intelligence/recommendations',
        ),
    },
  },
  marketplace: {
    rankings: {
      query: (assets: unknown[]) =>
        request<{ rankings: MarketplaceRanking[] }>('/api/marketplace/rankings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assets }),
        }),
    },
  },
  incidents: {
    postmortems: {
      generate: (incidentId: string) =>
        request(`/api/admin/incidents/${incidentId}/postmortem`, { method: 'POST' }),
    },
  },
  tenants: {
    migrations: {
      plan: (workspaceId: string, body: Record<string, unknown>) =>
        request(`/api/admin/tenants/${workspaceId}/migration-plan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }),
    },
  },
  improvementBundles: {
    apply: (bundleId: string, actorId?: string) =>
      request(`/api/improvement-bundles/${bundleId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actorId }),
      }),
  },
}
