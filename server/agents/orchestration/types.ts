export type OrchestrationNode = {
  id: string
  agentId: string
  allowedActions: string[]
}

export type OrchestrationEdge = {
  id: string
  source: string
  target: string
}

export type OrchestrationGraph = {
  nodes: OrchestrationNode[]
  edges: OrchestrationEdge[]
}

export type AgentRunMessage = {
  fromAgentId?: string
  toAgentId?: string
  role: 'SYSTEM' | 'AGENT' | 'TOOL' | 'USER'
  content: Record<string, unknown>
}
