import { CreatorSubscriptionStatus, PurchaseStatus } from '@prisma/client'
import { prisma } from '@/server/db/prisma'
import { markCreatorSubscriptionActiveByCheckoutSession, updateCreatorSubscriptionByStripeId } from '@/server/services/creator-subscription.service'
import { markTemplatePurchasePaidBySession } from '@/server/services/template-payment.service'

type StripeEvent = {
  id: string
  type: string
  data?: {
    object?: {
      id?: string
      metadata?: { type?: 'store_purchase' | 'template_purchase' | 'creator_subscription' }
      payment_intent?: string
      subscription?: string
      status?: string
    }
  }
}

export async function POST(req: Request) {
  const event = (await req.json()) as StripeEvent
  if (!event.id || !event.type) {
    return Response.json({ error: 'Invalid Stripe event payload' }, { status: 400 })
  }

  const existing = await prisma.stripeWebhookEvent.findUnique({ where: { id: event.id } })
  if (existing?.processed) {
    return Response.json({ ok: true, duplicate: true })
  }

  await prisma.stripeWebhookEvent.upsert({
    where: { id: event.id },
    create: { id: event.id, type: event.type, processed: false },
    update: { type: event.type },
  })

  const object = event.data?.object
  const metadataType = object?.metadata?.type

  if (event.type === 'checkout.session.completed') {
    if (metadataType === 'template_purchase' && object?.id) {
      await markTemplatePurchasePaidBySession(object.id, object.payment_intent)
    }
    if (metadataType === 'creator_subscription' && object?.id) {
      await markCreatorSubscriptionActiveByCheckoutSession(object.id, object.subscription)
    }
    if (metadataType === 'store_purchase') {
      // Existing store purchase flow can be handled here when purchase records are persisted.
    }
  }

  if (event.type === 'customer.subscription.updated' && object?.id) {
    const status =
      object.status === 'active'
        ? CreatorSubscriptionStatus.ACTIVE
        : object.status === 'past_due'
          ? CreatorSubscriptionStatus.PAST_DUE
          : CreatorSubscriptionStatus.CANCELLED
    await updateCreatorSubscriptionByStripeId(object.id, status)
  }

  if (event.type === 'customer.subscription.deleted' && object?.id) {
    await updateCreatorSubscriptionByStripeId(object.id, CreatorSubscriptionStatus.CANCELLED)
  }

  if (event.type === 'payment_intent.payment_failed' && object?.id) {
    await prisma.templatePurchase.updateMany({
      where: { stripePaymentIntent: object.id },
      data: { status: PurchaseStatus.FAILED },
    })
  }

  if (event.type === 'charge.refunded' && object?.payment_intent) {
    await prisma.templatePurchase.updateMany({
      where: { stripePaymentIntent: object.payment_intent },
      data: { status: PurchaseStatus.REFUNDED },
    })
  }

  await prisma.stripeWebhookEvent.update({
    where: { id: event.id },
    data: { processed: true },
  })

  return Response.json({ ok: true })
}
