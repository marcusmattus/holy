import {
  WorkflowRunStatus,
  WorkflowStepType,
  type Prisma,
  type WorkflowStepRun,
} from '@prisma/client'
import { prisma } from '@/server/services/prisma'

type WorkflowDefinitionStep = {
  key: string
  type: WorkflowStepType
  input?: Record<string, unknown>
}

type WorkflowDefinition = {
  steps: WorkflowDefinitionStep[]
}

const ALWAYS_APPROVAL_TYPES = new Set<WorkflowStepType>([
  WorkflowStepType.DEPLOY_PRODUCTION,
  WorkflowStepType.UPDATE_LISTING,
])
const DEFAULT_PATCH_VALUE = 'auto patch'

export function requiresApprovalForStep(
  step: WorkflowDefinitionStep,
  lowRiskAutoApplyEnabled: boolean,
) {
  if (ALWAYS_APPROVAL_TYPES.has(step.type)) return true
  if (step.type === WorkflowStepType.APPLY_PATCH && !lowRiskAutoApplyEnabled) {
    return true
  }
  return false
}

export async function createWorkflow(input: {
  ownerId: string
  workspaceId?: string
  name: string
  description?: string
  definition: WorkflowDefinition
}) {
  return prisma.workflow.create({
    data: {
      ownerId: input.ownerId,
      workspaceId: input.workspaceId,
      name: input.name,
      description: input.description,
      definition: input.definition as Prisma.InputJsonValue,
    },
  })
}

async function writeWorkflowAuditLog(
  action: string,
  payload: Prisma.JsonObject,
  workspaceId?: string,
) {
  await prisma.analyticsEvent.create({
    data: {
      event: `workflow_${action}`,
      workspaceId,
      metadata: payload,
    },
  })
}

export async function runWorkflow(
  workflowId: string,
  options?: {
    input?: Record<string, unknown>
    lowRiskAutoApplyEnabled?: boolean
  },
) {
  const workflow = await prisma.workflow.findUnique({ where: { id: workflowId } })
  if (!workflow) throw new Error('Workflow not found')

  const definition = workflow.definition as WorkflowDefinition
  const steps = Array.isArray(definition?.steps) ? definition.steps : []

  const run = await prisma.workflowRun.create({
    data: {
      workflowId,
      status: WorkflowRunStatus.RUNNING,
      startedAt: new Date(),
      input: options?.input as Prisma.InputJsonValue | undefined,
    },
  })

  const createdSteps: WorkflowStepRun[] = []
  const autoApply = Boolean(options?.lowRiskAutoApplyEnabled)
  for (const step of steps) {
    const requiresApproval = requiresApprovalForStep(step, autoApply)
    const status = requiresApproval
      ? WorkflowRunStatus.WAITING_APPROVAL
      : WorkflowRunStatus.COMPLETED
    const stepRun = await prisma.workflowStepRun.create({
      data: {
        workflowRunId: run.id,
        stepKey: step.key,
        type: step.type,
        input: step.input as Prisma.InputJsonValue | undefined,
        requiresApproval,
        status,
        output: requiresApproval
          ? undefined
          : ({ executed: true } as Prisma.InputJsonValue),
      },
    })
    createdSteps.push(stepRun)

    if (!requiresApproval && step.type === WorkflowStepType.APPLY_PATCH) {
      const projectId =
        typeof step.input?.projectId === 'string' ? step.input.projectId : null
      const patch =
        typeof step.input?.patch === 'string' ? step.input.patch : DEFAULT_PATCH_VALUE
      if (projectId) {
        await prisma.projectVersion.create({
          data: { projectId, code: patch },
        })
      }
    }
  }

  const waitingApproval = createdSteps.some(
    (step) => step.status === WorkflowRunStatus.WAITING_APPROVAL,
  )
  const updatedRun = await prisma.workflowRun.update({
    where: { id: run.id },
    data: waitingApproval
      ? { status: WorkflowRunStatus.WAITING_APPROVAL }
      : {
          status: WorkflowRunStatus.COMPLETED,
          completedAt: new Date(),
          output: { stepsExecuted: createdSteps.length },
        },
    include: { steps: true },
  })

  await writeWorkflowAuditLog(
    'run_started',
    { workflowId, runId: run.id, steps: createdSteps.length },
    workflow.workspaceId ?? undefined,
  )

  return updatedRun
}

export async function approveWorkflowStep(runId: string, stepId: string) {
  const step = await prisma.workflowStepRun.findFirst({
    where: { id: stepId, workflowRunId: runId },
    include: { workflowRun: { include: { workflow: true } } },
  })
  if (!step) throw new Error('Workflow step not found')
  if (!step.requiresApproval) {
    throw new Error('Step does not require approval')
  }

  await prisma.workflowStepRun.update({
    where: { id: step.id },
    data: {
      status: WorkflowRunStatus.APPROVED,
      approvedAt: new Date(),
      output: { approved: true },
    },
  })

  const remaining = await prisma.workflowStepRun.count({
    where: {
      workflowRunId: runId,
      requiresApproval: true,
      status: WorkflowRunStatus.WAITING_APPROVAL,
    },
  })

  const runStatus =
    remaining === 0 ? WorkflowRunStatus.COMPLETED : WorkflowRunStatus.WAITING_APPROVAL
  const run = await prisma.workflowRun.update({
    where: { id: runId },
    data:
      runStatus === WorkflowRunStatus.COMPLETED
        ? { status: runStatus, completedAt: new Date() }
        : { status: runStatus },
    include: { steps: true },
  })

  await writeWorkflowAuditLog(
    'step_approved',
    { runId, stepId },
    step.workflowRun.workflow.workspaceId ?? undefined,
  )

  return run
}
