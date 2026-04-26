import type {
  CreateProjectInput,
  DeployProjectInput,
  HolyClientConfig,
} from './types'

export class HolyClient {
  private readonly apiKey: string
  private readonly baseUrl: string

  constructor(config: HolyClientConfig) {
    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl ?? 'https://holy.holysticlabs.com'
  }

  private async request<T>(path: string, init?: RequestInit) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Holy SDK request failed: ${response.status}`)
    }

    return (await response.json()) as T
  }

  projects = {
    create: async (input: CreateProjectInput) =>
      this.request<{ project: { id: string; name: string } }>('/api/v1/projects', {
        method: 'POST',
        body: JSON.stringify(input),
      }).then((res) => res.project),
    get: async (projectId: string) =>
      this.request<{ project: unknown }>(`/api/v1/projects/${projectId}`).then(
        (res) => res.project,
      ),
    generate: async (projectId: string, input: { prompt: string }) =>
      this.request<{ version: unknown }>(`/api/v1/projects/${projectId}/generate`, {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    deploy: async (projectId: string, input: DeployProjectInput) =>
      this.request<{ deployment: unknown }>(`/api/v1/projects/${projectId}/deploy`, {
        method: 'POST',
        body: JSON.stringify(input),
      }),
  }

  templates = {
    list: async () => this.request<{ templates: unknown[] }>('/api/v1/templates'),
    fork: async (input: { name: string; description?: string; files?: Record<string, string> }) =>
      this.request<{ template: unknown }>('/api/v1/templates', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
  }

  store = {
    listings: async () =>
      this.request<{ listings: unknown[] }>('/api/v1/store/listings'),
  }

  agents = {
    run: async (agentId: string, input: { projectId?: string; listingId?: string }) =>
      this.request<{ run: unknown }>(`/api/agents/${agentId}/runs`, {
        method: 'POST',
        body: JSON.stringify(input),
      }),
  }
}
