import { executeWorkflowStep, type WorkflowStep } from '@/server/workflows/engine/step-executors'

export async function executeWorkflowSteps(steps: WorkflowStep[]) {
  const outputs: unknown[] = []
  for (const step of steps) {
    const result = await executeWorkflowStep(step)
    outputs.push({ stepId: step.id, ...result })
    if (result.status === 'PAUSED') {
      return { status: 'PAUSED', outputs }
    }
  }

  return { status: 'COMPLETED', outputs }
}
