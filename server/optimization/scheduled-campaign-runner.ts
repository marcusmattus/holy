import { audit } from '@/server/phase18/state'

export function runScheduledCampaign(campaignId: string, scheduleId: string) {
  const run = {
    campaignId,
    scheduleId,
    startedAt: new Date().toISOString(),
    riskClass: 'LOW',
    status: 'ANALYSIS_COMPLETE',
  }
  audit('optimization.schedule.run', run)
  return run
}
