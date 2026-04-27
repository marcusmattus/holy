import {
  approveSelfHealingRun,
  createSelfHealingRun,
  listSelfHealingRuns,
} from '@/server/self-healing/self-healing-engine'
import type { SelfHealingTriggerType } from '@/server/self-healing/diagnostics'

export async function startSelfHealingRun(input: {
  triggerType: SelfHealingTriggerType
  sourceType?: string
  sourceId?: string
}) {
  return createSelfHealingRun(input)
}

export async function approveRun(runId: string, approverId: string) {
  return approveSelfHealingRun(runId, approverId)
}

export async function getSelfHealingRuns() {
  return listSelfHealingRuns()
}
