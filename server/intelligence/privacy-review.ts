export function runIntelligencePrivacyReview(payload: Record<string, unknown>) {
  const serialized = JSON.stringify(payload)
  const blocksRawSensitiveFields =
    !serialized.toLowerCase().includes('financial') &&
    !serialized.toLowerCase().includes('private analytics') &&
    !serialized.toLowerCase().includes('project code')

  return {
    approved: blocksRawSensitiveFields,
    reason: blocksRawSensitiveFields
      ? 'Payload passed privacy checks for federated/global sharing'
      : 'Payload includes fields that cannot leave tenant scope',
  }
}
