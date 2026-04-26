import type { RuntimeExecutionPolicy } from './policy'

export interface RuntimeContext {
  workspaceId: string
  tenantId: string
  jobId: string
  payload: Record<string, unknown>
}

export function createTenantScopedContext(
  context: RuntimeContext,
  policy: RuntimeExecutionPolicy,
) {
  if (context.workspaceId !== policy.workspaceId || context.tenantId !== policy.tenantId) {
    throw new Error('Tenant context mismatch')
  }

  return {
    ...context,
    restrictions: {
      filesystem: 'ephemeral-only',
      network: policy.isolationMode === 'strict' ? 'deny-all' : 'allow-approved',
    },
  }
}
