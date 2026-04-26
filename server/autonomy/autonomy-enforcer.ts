import { AUTONOMY_ACTION_REGISTRY } from '@/server/autonomy/action-registry'

export function enforceAutonomyPolicy(input: {
  action: string
  workspaceAllowsPreviewDeploy?: boolean
}) {
  const definition = AUTONOMY_ACTION_REGISTRY.find((item) => item.action === input.action)
  if (!definition) {
    return { allowed: false, reason: 'Unknown action' }
  }

  if (definition.action === 'create-preview-deployment' && !input.workspaceAllowsPreviewDeploy) {
    return { allowed: false, reason: 'Workspace policy blocks preview deployment' }
  }

  if (!definition.autoAllowed) {
    return { allowed: false, reason: `Action ${definition.action} requires approval` }
  }

  return { allowed: true, reason: 'Low-risk action allowed by policy' }
}
