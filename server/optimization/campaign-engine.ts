import { createId, store, writeAuditEvent } from '@/server/core/in-memory-store'
import type { CampaignPolicy } from '@/server/optimization/campaign-policy'

export type OptimizationCampaignRecord = {
  id: string
  workspaceId?: string
  projectId?: string
  listingId?: string
  name: string
  goal: string
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'
  policy: CampaignPolicy
  successMetric?: string
  createdAt: string
  updatedAt: string
}

export async function createCampaign(input: {
  workspaceId?: string
  projectId?: string
  listingId?: string
  name: string
  goal: string
  policy: CampaignPolicy
  successMetric?: string
}) {
  const now = new Date().toISOString()
  const record: OptimizationCampaignRecord = {
    id: createId('camp'),
    workspaceId: input.workspaceId,
    projectId: input.projectId,
    listingId: input.listingId,
    name: input.name,
    goal: input.goal,
    status: 'DRAFT',
    policy: input.policy,
    successMetric: input.successMetric,
    createdAt: now,
    updatedAt: now,
  }

  store.optimizationCampaigns[record.id] = record
  writeAuditEvent({ category: 'optimization', action: 'campaign.created', metadata: { campaignId: record.id } })
  return record
}

export async function getCampaign(campaignId: string) {
  return store.optimizationCampaigns[campaignId] as OptimizationCampaignRecord | undefined
}

export async function listCampaigns() {
  return Object.values(store.optimizationCampaigns) as OptimizationCampaignRecord[]
}
