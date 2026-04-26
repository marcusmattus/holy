export function computeVelocityScore(input: {
  installVelocity: number
  forkVelocity: number
  purchaseVelocity: number
  workflowSuccessRate: number
  pluginRetention: number
}) {
  return (
    input.installVelocity * 0.25 +
    input.forkVelocity * 0.15 +
    input.purchaseVelocity * 0.2 +
    input.workflowSuccessRate * 0.2 +
    input.pluginRetention * 0.2
  )
}
