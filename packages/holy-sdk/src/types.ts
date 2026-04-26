export type VisualWorkflowDefinition = {
  version: '1.0'
  nodes: Array<{
    id: string
    type: string
    position: { x: number; y: number }
    data: Record<string, unknown>
  }>
  edges: Array<{
    id: string
    source: string
    target: string
    sourceHandle?: string
    targetHandle?: string
  }>
  settings: {
    requireApprovalForProduction: boolean
    autoRunQaBeforeDeploy: boolean
  }
}

export type HolyClientConfig = {
  apiKey: string
  baseUrl?: string
}
