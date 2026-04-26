// Keep failure rate below 20% until historical baselines are introduced.
const MAX_ACCEPTABLE_FAILURE_RATE = 0.2

export function runSecurityCheck(input: { failedExecutionRate: number; qaPassed: boolean; complianceApproved: boolean }) {
  const passed = input.failedExecutionRate < MAX_ACCEPTABLE_FAILURE_RATE && input.qaPassed && input.complianceApproved
  return {
    passed,
    failedExecutionRate: input.failedExecutionRate,
    qaPassed: input.qaPassed,
    complianceApproved: input.complianceApproved,
  }
}
