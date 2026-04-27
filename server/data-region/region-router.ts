export type DataRegion = 'US' | 'EU' | 'APAC'

export interface RegionRoutingDecision {
  workspaceId: string
  region: DataRegion
  allowed: boolean
  reason?: string
}

export function routeWorkspaceToRegion(workspaceId: string, preferredRegion: DataRegion): RegionRoutingDecision {
  return {
    workspaceId,
    region: preferredRegion,
    allowed: true,
  }
}
