/**
 * Holy Insights feature module
 *
 * Public surface:
 *  - trackEvent          — ingest a single analytics event
 *  - getDailyEventCounts — aggregate events by day for dashboards
 *  - upsertScenario      — save a revenue scenario with auto-calculated projections
 */

export {
  trackEvent,
  getDailyEventCounts,
  upsertScenario,
} from '@/server/services/insights.service'
