export interface RuntimeExecutionPolicy {
  workspaceId: string
  tenantId: string
  maxConcurrentExecutions: number
  timeoutMs: number
  isolationMode: 'sandboxed' | 'strict'
}

const workspaceUsage = new Map<string, number>()

export function canExecute(policy: RuntimeExecutionPolicy): boolean {
  const active = workspaceUsage.get(policy.workspaceId) ?? 0
  return active < policy.maxConcurrentExecutions
}

export function startExecution(workspaceId: string) {
  workspaceUsage.set(workspaceId, (workspaceUsage.get(workspaceId) ?? 0) + 1)
}

export function completeExecution(workspaceId: string) {
  const next = Math.max(0, (workspaceUsage.get(workspaceId) ?? 1) - 1)
  workspaceUsage.set(workspaceId, next)
}
