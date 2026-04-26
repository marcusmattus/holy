export function runSecurityCheck(input: { failedExecutionRate: number; qaPassed: boolean; complianceApproved: boolean }) {
  const passed = input.failedExecutionRate < 0.2 && input.qaPassed && input.complianceApproved
  return {
    passed,
    failedExecutionRate: input.failedExecutionRate,
    qaPassed: input.qaPassed,
    complianceApproved: input.complianceApproved,
  }
}
