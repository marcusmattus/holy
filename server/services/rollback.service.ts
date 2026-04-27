import { createId, writeAuditEvent } from '@/server/core/in-memory-store'

export async function proposeRollback(input: {
  projectId: string
  deploymentId?: string
  environment?: 'preview' | 'production'
  performanceRegression?: boolean
}) {
  const requiresApproval = input.environment === 'production'
  const recommendation = {
    id: createId('rollback'),
    projectId: input.projectId,
    deploymentId: input.deploymentId,
    reason: input.performanceRegression ? 'performance_regression' : 'deployment_failure',
    requiresApproval,
    status: 'PROPOSED',
    createdAt: new Date().toISOString(),
  }

  writeAuditEvent({
    category: 'deployments',
    action: 'rollback.proposed',
    metadata: recommendation,
  })

  return recommendation
}

export async function approveRollback(input: {
  recommendationId: string
  approvedById: string
  projectId: string
}) {
  writeAuditEvent({
    category: 'deployments',
    action: 'rollback.approved',
    actorId: input.approvedById,
    metadata: input,
  })

  return {
    ...input,
    status: 'APPROVED',
    deploymentRecordId: createId('deployment'),
    appliedAt: new Date().toISOString(),
  }
}
