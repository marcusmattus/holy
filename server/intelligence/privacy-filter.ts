import { anonymizeSignalMetadata } from '@/server/intelligence/anonymization'
import { meetsMinimumSampleSize } from '@/server/intelligence/k-anonymity'

export type WorkspacePrivacyConfig = {
  workspaceId?: string
  intelligenceOptOut?: boolean
}

export type RawSignal = {
  signalType: string
  scope: string
  value: number
  confidence: number
  sampleSize: number
  metadata?: Record<string, unknown>
  workspace?: WorkspacePrivacyConfig
}

export function privacyFilter(signal: RawSignal) {
  if (signal.workspace?.intelligenceOptOut) return null
  if (!meetsMinimumSampleSize(signal.sampleSize)) return null

  return {
    ...signal,
    metadata: anonymizeSignalMetadata(signal.metadata),
  }
}
