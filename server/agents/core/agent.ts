export type AgentContext = {
  agentId: string
  workspaceId?: string
  projectId?: string
  listingId?: string
  userId: string
}

export type AgentProposal = {
  title: string
  summary: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  actions: Array<
    | { type: 'PATCH_FILES'; files: Record<string, string>; summary: string }
    | { type: 'UPDATE_LISTING'; fields: Record<string, unknown>; summary: string }
    | {
        type: 'CREATE_GROWTH_SUGGESTION'
        fields: Record<string, unknown>
        summary: string
      }
    | { type: 'RUN_QA'; summary: string }
    | { type: 'DEPLOY_PREVIEW'; summary: string }
  >
}

export interface HolyAgent {
  type: string
  run(context: AgentContext): Promise<AgentProposal>
}
