import { analyzeMarketplaceTarget } from '@/server/marketplace/abuse/abuse-detector'
import { audit, makeId, phase18State } from '@/server/phase18/state'

export function recordMarketplaceAbuseAnalysis(targetType: string, targetId: string, metrics: {
  installVelocity: number
  reviewPatternScore: number
  duplicateContentScore: number
  reportSpike: number
  refundSpike: number
  referralAbuseScore: number
  rankingSwing: number
}) {
  const analysis = analyzeMarketplaceTarget(metrics)

  const signals = analysis.signals.map((signal) => ({
    id: makeId('abuse-signal'),
    targetType,
    targetId,
    signalType: signal.signalType,
    score: signal.score,
    createdAt: new Date().toISOString(),
  }))

  phase18State.abuseSignals.push(...signals)

  let enforcement = null
  if (analysis.proposesEnforcement) {
    enforcement = {
      id: makeId('abuse-action'),
      targetType,
      targetId,
      action: 'REQUIRE_REVIEW' as const,
      status: 'PROPOSED' as const,
      reason: 'Automated abuse risk exceeded threshold; admin review required',
      createdAt: new Date().toISOString(),
    }
    phase18State.enforcementActions.push(enforcement)
  }

  audit('marketplace.abuse.analyzed', { targetType, targetId, riskScore: analysis.riskScore })
  return { analysis, signals, enforcement }
}

export function approveMarketplaceEnforcement(actionId: string, approvedById: string) {
  const action = phase18State.enforcementActions.find((item) => item.id === actionId)
  if (!action) throw new Error('Action not found')

  if (action.action === 'SUSPEND' || action.action === 'REMOVE_REVIEW') {
    if (!approvedById) throw new Error('Human approval required')
  }

  action.status = 'APPROVED'
  action.approvedById = approvedById
  audit('marketplace.abuse.enforcement.approved', { actionId, approvedById })
  return action
}

export function listMarketplaceAbuse() {
  return {
    signals: phase18State.abuseSignals,
    actions: phase18State.enforcementActions,
  }
}
