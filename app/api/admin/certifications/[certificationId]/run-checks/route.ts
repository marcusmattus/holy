import { runCertificationChecks } from '@/server/services/certification-automation.service'

export async function POST(req: Request, context: { params: Promise<{ certificationId: string }> }) {
  const { certificationId } = await context.params
  const body = await req.json()

  const result = runCertificationChecks({
    requestedPermissions: Array.isArray(body.requestedPermissions) ? body.requestedPermissions : [],
    allowNetwork: Boolean(body.allowNetwork),
    hasSecretAccess: Boolean(body.hasSecretAccess),
    failedExecutionRate: Number(body.failedExecutionRate ?? 0),
    reviewScore: Number(body.reviewScore ?? 0),
    qaPassed: Boolean(body.qaPassed),
    complianceApproved: Boolean(body.complianceApproved),
    level: body.level === 'TRUSTED' || body.level === 'ENTERPRISE_READY' ? body.level : 'STANDARD',
  })

  return Response.json({ certificationId, result })
}
