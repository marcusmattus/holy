import { prisma } from '@/server/db'

export async function listEnterpriseInvoices(workspaceId: string) {
  return prisma.enterpriseInvoice.findMany({
    where: { workspaceId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function createEnterpriseInvoice(input: {
  workspaceId: string
  amountCents: number
  currency?: string
  contractId?: string
  dueDate?: Date
}) {
  return prisma.enterpriseInvoice.create({
    data: {
      workspaceId: input.workspaceId,
      amountCents: input.amountCents,
      currency: input.currency ?? 'gbp',
      contractId: input.contractId,
      dueDate: input.dueDate,
    },
  })
}
