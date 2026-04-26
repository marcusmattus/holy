export function anonymizeSignalMetadata(metadata: Record<string, unknown> = {}) {
  const redacted = { ...metadata }
  delete redacted.workspaceId
  delete redacted.projectId
  delete redacted.userId
  delete redacted.email
  return redacted
}

export function bucketizeMetric(value: number): string {
  if (value < 0.2) return '0-20%'
  if (value < 0.4) return '20-40%'
  if (value < 0.6) return '40-60%'
  if (value < 0.8) return '60-80%'
  return '80-100%'
}
