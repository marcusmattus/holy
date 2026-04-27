import { computeNextRunAt } from '@/server/optimization/optimization-scheduler'
import { runScheduledCampaign } from '@/server/optimization/scheduled-campaign-runner'
import { audit, makeId, phase18State } from '@/server/phase18/state'

const WORKSPACE_SCHEDULE_LIMIT = 5

export function createOptimizationSchedule(input: {
  campaignId: string
  workspaceId: string
  cron: string
  riskLevel?: 'LOW' | 'HIGH'
  policyApproved?: boolean
}) {
  const riskLevel = input.riskLevel ?? 'LOW'
  const requiresApproval = riskLevel !== 'LOW'
  if (requiresApproval && !input.policyApproved) {
    throw new Error('High-risk schedules require workspace policy approval')
  }

  const existing = phase18State.optimizationSchedules.filter((item) => item.workspaceId === input.workspaceId)
  if (existing.length >= WORKSPACE_SCHEDULE_LIMIT) {
    throw new Error('Workspace schedule limit reached')
  }

  const schedule = {
    id: makeId('schedule'),
    campaignId: input.campaignId,
    workspaceId: input.workspaceId,
    cron: input.cron,
    enabled: true,
    riskLevel,
    requiresApproval,
    nextRunAt: computeNextRunAt(input.cron),
  }

  phase18State.optimizationSchedules.push(schedule)
  audit('optimization.schedule.created', schedule)
  return schedule
}

export function runDueOptimizationSchedules() {
  const now = new Date().toISOString()
  const due = phase18State.optimizationSchedules.filter(
    (item) => item.enabled && item.nextRunAt !== undefined && item.nextRunAt <= now,
  )
  return due.map((schedule) => {
    const run = runScheduledCampaign(schedule.campaignId, schedule.id)
    schedule.lastRunAt = now
    schedule.nextRunAt = computeNextRunAt(schedule.cron)
    return run
  })
}
