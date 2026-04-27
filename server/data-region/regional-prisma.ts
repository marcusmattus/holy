import type { DataRegion } from './region-router'

export interface RegionalPrismaConfig {
  region: DataRegion
  databaseUrlRef: string
}

export function resolveRegionalPrisma(config: RegionalPrismaConfig) {
  return {
    region: config.region,
    databaseUrlRef: config.databaseUrlRef,
    mode: 'logical-routing',
  }
}
