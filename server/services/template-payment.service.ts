import { PurchaseStatus } from '@prisma/client'
import { prisma } from '@/server/db/prisma'

const PLATFORM_FEE_BPS = 1500

export async function createTemplateCheckoutSession(templateId: string, buyerId: string) {
  const template = await prisma.template.findUnique({ where: { id: templateId } })
  if (!template) {
    throw new Error('Template not found')
  }
  if (!template.isPaid || template.priceCents <= 0) {
    return { free: true, checkoutUrl: null }
  }

  const amountCents = template.priceCents
  const creatorShareCents = Math.floor((amountCents * (10000 - PLATFORM_FEE_BPS)) / 10000)
  const platformFeeCents = amountCents - creatorShareCents
  const stripeSessionId = `cs_${templateId}_${buyerId}_${Date.now()}`

  await prisma.templatePurchase.create({
    data: {
      templateId,
      buyerId,
      amountCents,
      currency: template.currency,
      stripeSessionId,
      status: PurchaseStatus.PENDING,
    },
  })

  return {
    free: false,
    checkoutUrl: `https://checkout.stripe.com/pay/${stripeSessionId}`,
    stripeSessionId,
    creatorShareCents,
    platformFeeCents,
  }
}

export async function markTemplatePurchasePaidBySession(stripeSessionId: string, paymentIntent?: string) {
  const purchase = await prisma.templatePurchase.findUnique({ where: { stripeSessionId } })
  if (!purchase || purchase.status === PurchaseStatus.PAID) {
    return purchase
  }

  return prisma.templatePurchase.update({
    where: { id: purchase.id },
    data: {
      status: PurchaseStatus.PAID,
      stripePaymentIntent: paymentIntent ?? purchase.stripePaymentIntent,
    },
  })
}

export async function hasTemplateAccess(templateId: string, userId: string) {
  const template = await prisma.template.findUnique({
    where: { id: templateId },
    select: { creatorId: true, isPaid: true, isSubscriberOnly: true },
  })

  if (!template) return false
  if (template.creatorId === userId) return true
  if (!template.isPaid && !template.isSubscriberOnly) return true

  const paidPurchase = await prisma.templatePurchase.findFirst({
    where: { templateId, buyerId: userId, status: PurchaseStatus.PAID },
    select: { id: true },
  })
  if (paidPurchase) return true

  if (template.isSubscriberOnly) {
    const subscription = await prisma.creatorSubscription.findFirst({
      where: {
        creatorId: template.creatorId,
        subscriberId: userId,
        status: 'ACTIVE',
      },
      select: { id: true },
    })
    return Boolean(subscription)
  }

  return false
}
