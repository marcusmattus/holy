import { PurchaseStatus } from '@prisma/client'
import { prisma } from '@/server/db'

export async function checkoutPlugin(input: {
  pluginId: string
  buyerId: string
  projectId?: string
}) {
  const plugin = await prisma.pluginListing.findUnique({ where: { id: input.pluginId } })
  if (!plugin) {
    throw new Error('Plugin not found')
  }

  if (!plugin.isPaid || plugin.amountCents <= 0) {
    return prisma.pluginPurchase.create({
      data: {
        pluginId: plugin.id,
        buyerId: input.buyerId,
        projectId: input.projectId,
        amountCents: 0,
        currency: plugin.currency,
        status: PurchaseStatus.PAID,
      },
    })
  }

  return prisma.pluginPurchase.create({
    data: {
      pluginId: plugin.id,
      buyerId: input.buyerId,
      projectId: input.projectId,
      amountCents: plugin.amountCents,
      currency: plugin.currency,
      status: PurchaseStatus.PENDING,
      stripeSessionId: `sess_${cryptoRandom()}`,
    },
  })
}

export async function markPluginPaymentVerified(purchaseId: string) {
  return prisma.pluginPurchase.update({
    where: { id: purchaseId },
    data: { status: PurchaseStatus.PAID },
  })
}

function cryptoRandom() {
  return Math.random().toString(36).slice(2, 12)
}
