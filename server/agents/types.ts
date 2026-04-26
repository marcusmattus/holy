import { AgentType } from '@prisma/client'
import type { AgentProposal } from '@/server/agents/core/agent'

export type AgentRunInput = {
  projectId?: string
  listingId?: string
  workspaceId?: string
}

export type AgentRunResult = {
  summary: string
  proposal: AgentProposal
}

export const SUPPORTED_AGENT_TYPES: AgentType[] = [
  'GROWTH_AGENT',
  'QA_AGENT',
  'SEO_AGENT',
  'PRICING_AGENT',
  'LISTING_AGENT',
  'ANALYTICS_AGENT',
  'DEPLOYMENT_AGENT',
]

export const ALLOWED_LISTING_UPDATE_FIELDS = [
  'name',
  'description',
  'price',
  'category',
  'tags',
  'visibility',
] as const
