import type { HolyClientConfig, VisualWorkflowDefinition } from '@/packages/holy-sdk/src/types'

async function request<T>(
  baseUrl: string,
  apiKey: string,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    throw new Error(`Holy SDK request failed: ${response.status}`)
  }

  return (await response.json()) as T
}

export function createHolyClient(config: HolyClientConfig) {
  const baseUrl = config.baseUrl ?? 'https://api.holy.dev'
  const apiKey = config.apiKey

  return {
    agents: {
      orchestrations: {
        create: (payload: { name: string; description?: string; graph: Record<string, unknown> }) =>
          request(baseUrl, apiKey, '/api/agents/orchestrations', {
            method: 'POST',
            body: JSON.stringify(payload),
          }),
        run: (orchestrationId: string, input?: Record<string, unknown>) =>
          request(baseUrl, apiKey, `/api/agents/orchestrations/${orchestrationId}/run`, {
            method: 'POST',
            body: JSON.stringify({ input }),
          }),
      },
    },
    workflows: {
      create: (payload: { name: string; definition: VisualWorkflowDefinition }) =>
        request(baseUrl, apiKey, '/api/workflows', {
          method: 'POST',
          body: JSON.stringify(payload),
        }),
      run: (workflowId: string, input?: Record<string, unknown>) =>
        request(baseUrl, apiKey, `/api/workflows/${workflowId}/run`, {
          method: 'POST',
          body: JSON.stringify(input ?? {}),
        }),
    },
    workflowTemplates: {
      install: (templateId: string) =>
        request(baseUrl, apiKey, `/api/workflow-templates/${templateId}/install`, {
          method: 'POST',
        }),
    },
    integrations: {
      list: () => request(baseUrl, apiKey, '/api/integrations'),
    },
    exports: {
      createDestination: (
        workspaceId: string,
        payload: { type: string; name: string; config: Record<string, unknown> },
      ) =>
        request(baseUrl, apiKey, `/api/workspaces/${workspaceId}/exports`, {
          method: 'POST',
          body: JSON.stringify(payload),
        }),
    },
    experiments: {
      assign: (experimentId: string, sessionId: string) =>
        request(baseUrl, apiKey, `/api/experiments/${experimentId}/assign`, {
          method: 'POST',
          body: JSON.stringify({ sessionId }),
        }),
      results: (experimentId: string) =>
        request(baseUrl, apiKey, `/api/experiments/${experimentId}/results`),
    },
  }
}
