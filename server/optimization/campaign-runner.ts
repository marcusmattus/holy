import { createId, store, writeAuditEvent } from '@/server/core/in-memory-store'
import { requiresCampaignApproval, type CampaignAction } from '@/server/optimization/campaign-policy'

type RunnerCampaign = { id: string; status: string; policy: { allowAutoDraftActions: boolean; requireApprovalForPublish: boolean } }

export async function runCampaign(campaignId: string, input: Record<string, unknown> = {}) {
  const campaign = store.optimizationCampaigns[campaignId] as
    | RunnerCampaign
    | undefined

  if (!campaign) throw new Error('Campaign not found')

  const proposedActions: CampaignAction[] = [
    {
      id: createId('ca'),
      type: 'COPY_UPDATE',
      riskLevel: 'LOW',
      payload: { target: 'listing_description', suggestion: 'Improve clarity and CTA.' },
    },
    {
      id: createId('ca'),
      type: 'DEPLOY',
      riskLevel: 'HIGH',
      payload: { environment: 'production' },
    },
  ]

  const appliedActions = proposedActions.filter((action) => !requiresCampaignApproval(action, campaign.policy))

  const run = {
    id: createId('camp_run'),
    campaignId,
    status: 'COMPLETED',
    input,
    output: {
      summary: 'Autonomous optimization run completed with governed actions.',
      approvedActionCount: proposedActions.length - appliedActions.length,
    },
    proposedActions,
    appliedActions,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  store.optimizationRuns[run.id] = run

  writeAuditEvent({
    category: 'optimization',
    action: 'campaign.run',
    metadata: { campaignId, runId: run.id },
  })

  return run
}

export async function approveCampaignAction(runId: string, actionId: string, approverId: string) {
  const run = store.optimizationRuns[runId] as
    | { proposedActions?: CampaignAction[]; appliedActions?: CampaignAction[] }
    | undefined

  if (!run) throw new Error('Campaign run not found')

  const action = run.proposedActions?.find((item) => item.id === actionId)
  if (!action) throw new Error('Action not found')

  run.appliedActions = [...(run.appliedActions ?? []), action]

  writeAuditEvent({
    category: 'optimization',
    action: 'campaign.action.approved',
    actorId: approverId,
    metadata: { runId, actionId },
  })

  return run
}
