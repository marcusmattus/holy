function clampUnit(value: number) {
  if (Number.isNaN(value)) return 0
  return Math.min(1, Math.max(0, value))
}

const VELOCITY_WEIGHTS = {
  installVelocity: 0.25,
  forkVelocity: 0.15,
  purchaseVelocity: 0.2,
  workflowSuccessRate: 0.2,
  pluginRetention: 0.2,
} as const
const WEIGHT_TOLERANCE = 0.0001

function getValidatedVelocityWeights() {
  const weightTotal = Object.values(VELOCITY_WEIGHTS).reduce(
    (acc, weight) => acc + weight,
    0,
  )
  if (Math.abs(weightTotal - 1) <= WEIGHT_TOLERANCE) return VELOCITY_WEIGHTS

  return {
    installVelocity: VELOCITY_WEIGHTS.installVelocity / weightTotal,
    forkVelocity: VELOCITY_WEIGHTS.forkVelocity / weightTotal,
    purchaseVelocity: VELOCITY_WEIGHTS.purchaseVelocity / weightTotal,
    workflowSuccessRate: VELOCITY_WEIGHTS.workflowSuccessRate / weightTotal,
    pluginRetention: VELOCITY_WEIGHTS.pluginRetention / weightTotal,
  }
}

export function computeVelocityScore(input: {
  installVelocity: number
  forkVelocity: number
  purchaseVelocity: number
  workflowSuccessRate: number
  pluginRetention: number
}) {
  const installVelocity = clampUnit(input.installVelocity)
  const forkVelocity = clampUnit(input.forkVelocity)
  const purchaseVelocity = clampUnit(input.purchaseVelocity)
  const workflowSuccessRate = clampUnit(input.workflowSuccessRate)
  const pluginRetention = clampUnit(input.pluginRetention)
  const weights = getValidatedVelocityWeights()

  return (
    installVelocity * weights.installVelocity +
    forkVelocity * weights.forkVelocity +
    purchaseVelocity * weights.purchaseVelocity +
    workflowSuccessRate * weights.workflowSuccessRate +
    pluginRetention * weights.pluginRetention
  )
}
