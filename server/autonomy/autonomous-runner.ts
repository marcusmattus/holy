import { enforceAutonomyPolicy } from '@/server/autonomy/autonomy-enforcer'

export async function runAutonomousAction(input: {
  action: string
  payload?: Record<string, unknown>
  workspaceAllowsPreviewDeploy?: boolean
}) {
  const decision = enforceAutonomyPolicy(input)
  if (!decision.allowed) {
    return {
      status: 'proposal-required',
      reason: decision.reason,
      reversible: true,
      output: {
        draftProposal: {
          action: input.action,
          payload: input.payload ?? {},
        },
      },
    }
  }

  return {
    status: 'executed',
    reason: decision.reason,
    reversible: true,
    output: {
      action: input.action,
      payload: input.payload ?? {},
      executedAt: new Date().toISOString(),
    },
  }
}
