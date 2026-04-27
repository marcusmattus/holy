import { enforcePrivacyBudget } from '@/server/federated/privacy-budget'
import { runFederatedAggregationRound } from '@/server/federated/federated-provider'
import { audit, makeId, phase18State } from '@/server/phase18/state'
import type { FederatedLearningTarget } from '@/server/phase18/types'

export function createFederatedRound(name: string, target: FederatedLearningTarget, minSampleSize = 25, enterpriseOptOutWorkspaceIds: string[] = []) {
  const round = {
    id: makeId('fed-round'),
    name,
    status: 'RUNNING' as const,
    target,
    minSampleSize,
    enterpriseOptOutWorkspaceIds,
    createdAt: new Date().toISOString(),
  }
  phase18State.federatedRounds.push(round)
  audit('federated.round.created', round)
  return round
}

export function submitFederatedModelUpdate(input: {
  roundId: string
  workspaceId?: string
  signalHash: string
  updateJson: Record<string, unknown>
  sampleSize: number
  privacyBudgetRequested?: number
}) {
  const round = phase18State.federatedRounds.find((item) => item.id === input.roundId)
  if (!round) throw new Error('Round not found')

  if (input.workspaceId && round.enterpriseOptOutWorkspaceIds?.includes(input.workspaceId)) {
    throw new Error('Workspace has opted out of global intelligence')
  }

  const numericScore = Number(input.updateJson.score ?? 0)
  const privacyBudgetUsed = enforcePrivacyBudget(0, input.privacyBudgetRequested ?? 0)
  const accepted = input.sampleSize >= round.minSampleSize
  const update = {
    id: makeId('fed-update'),
    roundId: input.roundId,
    workspaceId: input.workspaceId,
    signalHash: input.signalHash,
    updateJson: { ...input.updateJson, score: numericScore },
    sampleSize: input.sampleSize,
    privacyBudgetUsed,
    accepted,
    createdAt: new Date().toISOString(),
  }
  phase18State.federatedUpdates.push(update)
  audit('federated.model-update.submitted', { id: update.id, accepted })
  return update
}

export function finalizeFederatedRound(roundId: string) {
  const round = phase18State.federatedRounds.find((item) => item.id === roundId)
  if (!round) throw new Error('Round not found')

  const updates = phase18State.federatedUpdates
    .filter((item) => item.roundId === roundId)
    .map((item) => ({ score: Number(item.updateJson.score ?? 0), sampleSize: item.sampleSize }))

  const summary = runFederatedAggregationRound(updates, round.minSampleSize)
  round.status = 'COMPLETED'
  audit('federated.round.completed', { roundId, summary })
  return { round, summary }
}

export function listFederatedRounds() {
  return phase18State.federatedRounds
}
