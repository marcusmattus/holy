export type WorkflowStep = {
  id: string
  type: 'task' | 'approval'
  action: string
}

export async function executeWorkflowStep(step: WorkflowStep) {
  if (step.type === 'approval') {
    return { status: 'PAUSED', reason: 'awaiting_approval' as const }
  }

  return {
    status: 'COMPLETED' as const,
    output: { action: step.action, ok: true },
  }
}
