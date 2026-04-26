import type { ProcurementRequestInput, RuntimeClusterNode, WorkerPool } from '@/packages/holy-sdk/src/types'

class HolyClient {
  constructor(private readonly baseUrl: string) {}

  runtime = {
    clusters: {
      list: async (): Promise<{ nodes: RuntimeClusterNode[] }> => this.get('/api/admin/runtime-clusters'),
    },
  }

  workerPools = {
    list: async (): Promise<{ pools: WorkerPool[] }> => this.get('/api/admin/worker-pools'),
  }

  procurement = {
    requests: {
      create: async (payload: ProcurementRequestInput) =>
        this.post(`/api/workspaces/${payload.workspaceId}/procurement`, payload),
      approve: async (workspaceId: string, procurementId: string) =>
        this.post(`/api/workspaces/${workspaceId}/procurement`, { action: 'approve', procurementId }),
    },
  }

  plugins = {
    checkout: async (pluginId: string, projectId?: string) => this.post(`/api/plugins/${pluginId}/checkout`, { projectId }),
  }

  incidents = {
    list: async () => this.get('/api/admin/incidents'),
  }

  autonomy = {
    runs: {
      list: async () => this.get('/api/autonomy/runs'),
    },
  }

  semanticSearch = {
    query: async (question: string) => this.post('/api/search/marketplace/ask', { question }),
  }

  enterprise = {
    invoices: {
      list: async (workspaceId: string) => this.get(`/api/workspaces/${workspaceId}/enterprise-invoices`),
    },
  }

  private async get(path: string) {
    const response = await fetch(`${this.baseUrl}${path}`)
    return response.json()
  }

  private async post(path: string, payload: unknown) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return response.json()
  }
}

export function createHolyClient(baseUrl: string) {
  return new HolyClient(baseUrl)
}
