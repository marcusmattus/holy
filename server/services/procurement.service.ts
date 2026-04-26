import { ProcurementStatus } from '@prisma/client'
import { prisma } from '@/server/db'

const APPROVAL_THRESHOLD_CENTS = Number(process.env.PROCUREMENT_APPROVAL_THRESHOLD_CENTS ?? 10_000)

export async function createProcurementRequest(input: {
  workspaceId: string
  requestedById: string
  assetType: 'STORE_LISTING' | 'TEMPLATE' | 'AGENT_LISTING' | 'WORKFLOW_TEMPLATE' | 'PLUGIN' | 'INTEGRATION' | 'ENTERPRISE_PLAN'
  assetId: string
  amountCents: number
  currency?: string
  notes?: string
}) {
  return prisma.procurementRequest.create({
    data: {
      workspaceId: input.workspaceId,
      requestedById: input.requestedById,
      assetType: input.assetType,
      assetId: input.assetId,
      amountCents: input.amountCents,
      currency: input.currency ?? 'gbp',
      notes: input.notes,
    },
  })
}

export async function approveProcurementRequest(input: {
  procurementId: string
  approvedById: string
  approverWorkspaceRole: 'admin' | 'member'
}) {
  const request = await prisma.procurementRequest.findUnique({ where: { id: input.procurementId } })
  if (!request) {
    throw new Error('Procurement request not found')
  }

  if (request.amountCents >= APPROVAL_THRESHOLD_CENTS && input.approverWorkspaceRole !== 'admin') {
    throw new Error('Workspace admin approval required above threshold')
  }

  const approved = await prisma.procurementRequest.update({
    where: { id: request.id },
    data: {
      status: ProcurementStatus.APPROVED,
      approvedById: input.approvedById,
    },
  })

  await prisma.auditLog.create({
    data: {
      actorId: input.approvedById,
      actorType: 'user',
      action: 'procurement.approved',
      resourceId: approved.id,
      metadata: {
        workspaceId: approved.workspaceId,
        amountCents: approved.amountCents,
      },
    },
  })

  return approved
}
