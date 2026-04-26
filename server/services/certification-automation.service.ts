import { runPermissionsCheck } from '@/server/certification/checks/permissions-check'
import { runReviewScoreCheck } from '@/server/certification/checks/review-score-check'
import { runRuntimePolicyCheck } from '@/server/certification/checks/runtime-policy-check'
import { runSecurityCheck } from '@/server/certification/checks/security-check'

export interface CertificationCheckInput {
  requestedPermissions: string[]
  allowNetwork: boolean
  hasSecretAccess: boolean
  failedExecutionRate: number
  reviewScore: number
  qaPassed: boolean
  complianceApproved: boolean
  level: 'STANDARD' | 'TRUSTED' | 'ENTERPRISE_READY'
}

export function runCertificationChecks(input: CertificationCheckInput) {
  const permissions = runPermissionsCheck(input.requestedPermissions)
  const runtime = runRuntimePolicyCheck({ allowNetwork: input.allowNetwork, hasSecretAccess: input.hasSecretAccess })
  const review = runReviewScoreCheck(input.reviewScore)
  const security = runSecurityCheck({
    failedExecutionRate: input.failedExecutionRate,
    qaPassed: input.qaPassed,
    complianceApproved: input.complianceApproved,
  })

  const autoApproved = permissions.passed && runtime.passed && review.passed && security.passed && input.level === 'STANDARD'

  return {
    permissions,
    runtime,
    review,
    security,
    autoApproved,
    requiresHumanApproval: input.level !== 'STANDARD',
  }
}
