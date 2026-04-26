import { randomUUID } from 'node:crypto'
import { prisma } from '@/server/db'

function normalizeDomain(domain: string) {
  return domain.toLowerCase().trim()
}

export async function createDomainVerification(input: {
  whiteLabelSiteId: string
  domain: string
}) {
  const normalizedDomain = normalizeDomain(input.domain)

  const existing = await prisma.whiteLabelDomainVerification.findUnique({
    where: { domain: normalizedDomain },
    include: { whiteLabelSite: true },
  })

  if (existing && existing.whiteLabelSiteId !== input.whiteLabelSiteId) {
    throw new Error('Domain is already claimed by another tenant')
  }

  return prisma.whiteLabelDomainVerification.upsert({
    where: { domain: normalizedDomain },
    update: {},
    create: {
      whiteLabelSiteId: input.whiteLabelSiteId,
      domain: normalizedDomain,
      txtRecordName: `_holy-verify.${normalizedDomain}`,
      txtRecordValue: `holy-${randomUUID()}`,
    },
  })
}

export async function verifyDomain(input: {
  workspaceId: string
  domain: string
  txtValue?: string
}) {
  const domain = normalizeDomain(input.domain)

  const record = await prisma.whiteLabelDomainVerification.findUnique({
    where: { domain },
    include: { whiteLabelSite: true },
  })

  if (!record) throw new Error('Verification record not found')
  if (record.whiteLabelSite.workspaceId !== input.workspaceId) {
    throw new Error('Cross-tenant domain verification access denied')
  }

  const isVerified = input.txtValue === record.txtRecordValue

  return prisma.whiteLabelDomainVerification.update({
    where: { id: record.id },
    data: {
      status: isVerified ? 'VERIFIED' : 'FAILED',
      verifiedAt: isVerified ? new Date() : null,
    },
  })
}
