import type {
  FederatedRound,
  MarketplaceAbuseSignal,
  OptimizationSchedule,
  RegionHealth,
  StatusComponent,
  TransparencyReportResponse,
} from '@/packages/holy-sdk/src/types'

class HolySDKClient {
  constructor(private readonly baseUrl: string) {}

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    })
    if (!response.ok) throw new Error(`Holy SDK request failed: ${response.status}`)
    return response.json()
  }

  regions = {
    health: () => this.request<{ health: RegionHealth[] }>('/api/admin/regions'),
    failover: {
      propose: (region: string, body: Record<string, unknown>) =>
        this.request(`/api/admin/regions/${region}/failover`, {
          method: 'POST',
          body: JSON.stringify(body),
        }),
    },
  }

  federated = {
    rounds: {
      list: () => this.request<{ rounds: FederatedRound[] }>('/api/admin/federated/rounds'),
    },
  }

  optimization = {
    schedules: {
      create: (campaignId: string, body: Record<string, unknown>) =>
        this.request<OptimizationSchedule>(`/api/optimization/campaigns/${campaignId}/schedule`, {
          method: 'POST',
          body: JSON.stringify(body),
        }),
    },
  }

  marketplace = {
    abuse: {
      signals: {
        list: () => this.request<{ signals: MarketplaceAbuseSignal[] }>('/api/admin/marketplace/abuse'),
      },
    },
  }

  tenants = {
    migrations: {
      execute: (runId: string) =>
        this.request(`/api/admin/tenants/migration-runs/${runId}/execute`, { method: 'POST' }),
    },
  }

  status = {
    components: {
      list: () => this.request<{ components: StatusComponent[] }>('/api/status'),
    },
  }

  trust = {
    transparency: {
      get: () => this.request<TransparencyReportResponse>('/api/admin/transparency/generate', { method: 'POST', body: JSON.stringify({ approvedForPublish: false }) }),
    },
  }

  settlement = {
    reconciliation: {
      run: () => this.request('/api/admin/settlement/reconciliation', { method: 'POST' }),
    },
  }

  intelligence = {
    policies: {
      update: (workspaceId: string, body: Record<string, unknown>) =>
        this.request(`/api/workspaces/${workspaceId}/intelligence-policy`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        }),
    },
  }
}

export function createHolyClient(baseUrl: string) {
  return new HolySDKClient(baseUrl)
}
