import { createCampaign, getCampaign, listCampaigns } from '@/server/optimization/campaign-engine'
import { defaultCampaignPolicy } from '@/server/optimization/campaign-policy'
import { approveCampaignAction, runCampaign } from '@/server/optimization/campaign-runner'

export async function createOptimizationCampaign(input: {
  workspaceId?: string
  projectId?: string
  listingId?: string
  name: string
  goal: string
  successMetric?: string
}) {
  return createCampaign({ ...input, policy: defaultCampaignPolicy })
}

export async function listOptimizationCampaigns() {
  return listCampaigns()
}

export async function runOptimizationCampaign(campaignId: string, input?: Record<string, unknown>) {
  return runCampaign(campaignId, input)
}

export async function approveOptimizationAction(runId: string, actionId: string, approverId: string) {
  return approveCampaignAction(runId, actionId, approverId)
}

export async function getOptimizationCampaign(campaignId: string) {
  return getCampaign(campaignId)
}
