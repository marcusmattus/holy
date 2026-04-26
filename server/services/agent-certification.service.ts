import { PrismaClient, CertificationStatus, CertificationLevel } from '@prisma/client'
import { auditLog } from '@/server/observability/logger'

const prisma = new PrismaClient()

export async function listAgentCertifications() {
  return prisma.agentCertification.findMany({
    orderBy: { createdAt: 'asc' },
    include: { agentListing: true },
  })
}

export async function reviewAgentCertification(params: {
  certificationId: string
  reviewerId?: string
  approve: boolean
}) {
  const status = params.approve ? CertificationStatus.CERTIFIED : CertificationStatus.REJECTED
  const certification = await prisma.agentCertification.update({
    where: { id: params.certificationId },
    data: {
      status,
      level: params.approve ? CertificationLevel.VERIFIED : null,
      reviewedById: params.reviewerId,
      issuedAt: params.approve ? new Date() : null,
    },
  })

  auditLog({
    action: 'agent.certification.review',
    actor: params.reviewerId ?? 'admin',
    resource: certification.id,
    metadata: { status: certification.status },
  })

  return certification
}
