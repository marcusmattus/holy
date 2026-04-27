import type {
  DataRegion,
  FailoverStatus,
  FederatedLearningTarget,
  FederatedRoundStatus,
  PublicComponentStatus,
  PublicIncidentImpact,
  PublicIncidentStatus,
  RegionStatus,
} from './types'

const id = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

export interface RegionRecord {
  id: string
  region: DataRegion
  name: string
  status: RegionStatus
  priority: number
  metadata?: Record<string, unknown>
  lastHealthCheckAt?: string
}

export interface FailoverEvent {
  id: string
  fromRegion: DataRegion
  toRegion: DataRegion
  reason: string
  status: FailoverStatus
  approvedById?: string
  executedAt?: string
  metadata?: Record<string, unknown>
  createdAt: string
}

export interface FederatedRound {
  id: string
  name: string
  status: FederatedRoundStatus
  target: FederatedLearningTarget
  minSampleSize: number
  enterpriseOptOutWorkspaceIds?: string[]
  createdAt: string
}

export interface FederatedUpdate {
  id: string
  roundId: string
  workspaceId?: string
  signalHash: string
  updateJson: Record<string, unknown>
  sampleSize: number
  privacyBudgetUsed: number
  accepted: boolean
  createdAt: string
}

export interface OptimizationScheduleRecord {
  id: string
  campaignId: string
  cron: string
  enabled: boolean
  riskLevel: 'LOW' | 'HIGH'
  requiresApproval: boolean
  workspaceId: string
  lastRunAt?: string
  nextRunAt?: string
}

export interface MarketplaceAbuseSignalRecord {
  id: string
  targetType: string
  targetId: string
  signalType: string
  score: number
  metadata?: Record<string, unknown>
  createdAt: string
}

export interface MarketplaceEnforcementActionRecord {
  id: string
  targetType: string
  targetId: string
  action: 'DEMOTE' | 'HIDE' | 'SUSPEND' | 'REQUIRE_REVIEW' | 'REMOVE_REVIEW'
  status: 'PROPOSED' | 'APPROVED' | 'APPLIED' | 'DISMISSED'
  reason: string
  approvedById?: string
  createdAt: string
}

export interface TenantMigrationRunRecord {
  id: string
  workspaceId: string
  fromRegion: DataRegion
  toRegion: DataRegion
  status:
    | 'DRAFT'
    | 'DRY_RUN_COMPLETE'
    | 'APPROVED'
    | 'RUNNING'
    | 'COMPLETED'
    | 'FAILED'
    | 'ROLLED_BACK'
    | 'CANCELLED'
  plan: Record<string, unknown>
  dryRunResult?: Record<string, unknown>
  rollbackPlan?: Record<string, unknown>
  approvedById?: string
  executedAt?: string
  error?: string
  createdAt: string
}

export interface StatusComponentRecord {
  id: string
  name: string
  slug: string
  description?: string
  status: PublicComponentStatus
}

export interface PublicIncidentRecord {
  id: string
  title: string
  impact: PublicIncidentImpact
  status: PublicIncidentStatus
  summary: string
  visible: boolean
  startedAt: string
  resolvedAt?: string
  updates: Array<{ id: string; message: string; createdAt: string }>
}

export interface WorkspaceIntelligencePolicyRecord {
  workspaceId: string
  allowAggregatedLearning: boolean
  optedOutOfGlobalIntelligence: boolean
  allowAnonymizedBenchmarking: boolean
  disablePersonalizedRecommendations: boolean
  strictModeDefaultsConservative: boolean
}

export const phase18State = {
  regionControlPlanes: [
    {
      id: id(),
      region: 'US_EAST' as DataRegion,
      name: 'US East Primary',
      status: 'ACTIVE' as RegionStatus,
      priority: 100,
      lastHealthCheckAt: new Date().toISOString(),
    },
    {
      id: id(),
      region: 'EU_CENTRAL' as DataRegion,
      name: 'EU Central Active',
      status: 'ACTIVE' as RegionStatus,
      priority: 90,
      lastHealthCheckAt: new Date().toISOString(),
    },
  ] as RegionRecord[],
  failoverEvents: [] as FailoverEvent[],
  federatedRounds: [] as FederatedRound[],
  federatedUpdates: [] as FederatedUpdate[],
  optimizationSchedules: [] as OptimizationScheduleRecord[],
  abuseSignals: [] as MarketplaceAbuseSignalRecord[],
  enforcementActions: [] as MarketplaceEnforcementActionRecord[],
  migrationRuns: [] as TenantMigrationRunRecord[],
  statusComponents: [
    {
      id: id(),
      name: 'Core API',
      slug: 'core-api',
      description: 'Primary API control plane',
      status: 'OPERATIONAL' as PublicComponentStatus,
    },
  ] as StatusComponentRecord[],
  incidents: [] as PublicIncidentRecord[],
  intelligencePolicies: [] as WorkspaceIntelligencePolicyRecord[],
  audits: [] as Array<Record<string, unknown>>,
}

export function makeId(prefix: string) {
  return `${prefix}-${id()}`
}

export function audit(event: string, payload: Record<string, unknown>) {
  phase18State.audits.push({ id: makeId('audit'), event, payload, at: new Date().toISOString() })
}
