import { CertificationLevel, CertificationStatus } from '@prisma/client'
import { prisma } from '@/server/db'

export async function requestPluginCertification(pluginId: string) {
  return prisma.pluginCertification.create({
    data: {
      pluginId,
      checks: {
        manifestValidated: true,
        complianceReviewed: true,
      },
      status: CertificationStatus.PENDING,
    },
  })
}

export async function reviewPluginCertification(input: {
  certificationId: string
  reviewerId: string
  approve: boolean
  level?: CertificationLevel
}) {
  if (input.level === CertificationLevel.ENTERPRISE && !input.approve) {
    throw new Error('Enterprise certification cannot be issued without approval')
  }

  return prisma.pluginCertification.update({
    where: { id: input.certificationId },
    data: {
      reviewedById: input.reviewerId,
      status: input.approve ? CertificationStatus.APPROVED : CertificationStatus.REJECTED,
      level: input.approve ? input.level ?? CertificationLevel.BASIC : null,
      issuedAt: input.approve ? new Date() : null,
      expiresAt: input.approve ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : null,
    },
  })
}
