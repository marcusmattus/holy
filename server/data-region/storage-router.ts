import type { DataRegion } from './region-router'

export interface StorageRoutingDecision {
  bucketRef: string | null
  region: DataRegion
  exportAllowed: boolean
}

export function routeStorage(region: DataRegion): StorageRoutingDecision {
  const exportAllowedRegions: DataRegion[] = ['US', 'EU']
  return {
    bucketRef: `storage-${region.toLowerCase()}`,
    region,
    exportAllowed: exportAllowedRegions.includes(region),
  }
}
