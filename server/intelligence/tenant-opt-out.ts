import { phase18State } from '@/server/phase18/state'

export function isWorkspaceOptedOut(workspaceId: string) {
  const policy = phase18State.intelligencePolicies.find((item) => item.workspaceId === workspaceId)
  return Boolean(policy?.optedOutOfGlobalIntelligence)
}
