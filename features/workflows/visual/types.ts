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

export const DEFAULT_WORKFLOW_DEFINITION: VisualWorkflowDefinition = {
  version: '1.0',
  nodes: [
    {
      id: 'agent-1',
      type: 'RUN_AGENT',
      position: { x: 40, y: 60 },
      data: { label: 'Run Agent', action: 'READ_ANALYTICS' },
    },
    {
      id: 'approval-1',
      type: 'APPROVAL_GATE',
      position: { x: 340, y: 60 },
      data: { label: 'Approval Gate', requiredFor: 'DEPLOY_PRODUCTION' },
    },
  ],
  edges: [{ id: 'e1', source: 'agent-1', target: 'approval-1' }],
  settings: {
    requireApprovalForProduction: true,
    autoRunQaBeforeDeploy: true,
  },
}
