export type DataRegion = 'US_EAST' | 'US_WEST' | 'EU_CENTRAL' | 'AP_SOUTHEAST'

export type RegionStatus = 'ACTIVE' | 'DEGRADED' | 'FAILING_OVER' | 'DISABLED'
export type FailoverStatus =
  | 'PROPOSED'
  | 'APPROVED'
  | 'EXECUTED'
  | 'FAILED'
  | 'CANCELLED'

export type FederatedRoundStatus =
  | 'DRAFT'
  | 'RUNNING'
  | 'AGGREGATING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'

export type FederatedLearningTarget =
  | 'MARKETPLACE_RANKING'
  | 'SEARCH_RELEVANCE'
  | 'OPTIMIZATION_RECOMMENDATIONS'
  | 'ABUSE_DETECTION'
  | 'AGENT_QUALITY'

export type PublicComponentStatus =
  | 'OPERATIONAL'
  | 'DEGRADED'
  | 'PARTIAL_OUTAGE'
  | 'MAJOR_OUTAGE'
  | 'MAINTENANCE'

export type PublicIncidentImpact = 'NONE' | 'MINOR' | 'MAJOR' | 'CRITICAL'
export type PublicIncidentStatus =
  | 'INVESTIGATING'
  | 'IDENTIFIED'
  | 'MONITORING'
  | 'RESOLVED'
