import { evaluateActionPolicy } from '@/server/agents/policies/action-policy'

export type RoutedAgentRequest = {
  agentId: string
  allowedActions: string[]
  requestedAction: string
  payload: Record<string, unknown>
}

export function routeAgentRequest(input: RoutedAgentRequest) {
  const policy = evaluateActionPolicy({
    action: input.requestedAction,
    allowedActions: input.allowedActions,
  })

  return {
    agentId: input.agentId,
    action: input.requestedAction,
    policy,
    output: {
      structured: true,
      summary: `Agent ${input.agentId} processed ${input.requestedAction}`,
      data: input.payload,
    },
  }
}
