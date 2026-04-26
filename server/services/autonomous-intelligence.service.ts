import { AutonomyRiskLevel, AutonomyRunStatus, Prisma } from '@prisma/client'
import { prisma } from '@/server/db'
import { runAutonomousAction } from '@/server/autonomy/autonomous-runner'

export async function createAutonomyRun(input: {
  workspaceId: string
  initiatedById?: string
  action: string
  workspaceAllowsPreviewDeploy?: boolean
}) {
  const outcome = await runAutonomousAction({
    action: input.action,
    workspaceAllowsPreviewDeploy: input.workspaceAllowsPreviewDeploy,
  })

  const run = await prisma.autonomousRun.create({
    data: {
      workspaceId: input.workspaceId,
      initiatedById: input.initiatedById,
      action: input.action,
      riskLevel: AutonomyRiskLevel.LOW,
      status:
        outcome.status === 'executed'
          ? AutonomyRunStatus.EXECUTED
          : AutonomyRunStatus.PROPOSED,
      details: outcome as Prisma.InputJsonValue,
    },
  })

  await prisma.auditLog.create({
    data: {
      actorId: input.initiatedById,
      actorType: 'autonomy',
      action: 'autonomy.run',
      resourceId: run.id,
      metadata: outcome as Prisma.InputJsonValue,
    },
  })

  return run
}

export async function listAutonomyRuns() {
  return prisma.autonomousRun.findMany({ orderBy: { createdAt: 'desc' } })
}
