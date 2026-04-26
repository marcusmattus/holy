import { CreatorSubscriptionStatus, PurchaseStatus } from '@prisma/client'
import Stripe from 'stripe'
import { prisma } from '@/server/db/prisma'
import { getStripe } from '@/server/payments/stripe'
import { markCreatorSubscriptionActiveByCheckoutSession, updateCreatorSubscriptionByStripeId } from '@/server/services/creator-subscription.service'
import { markTemplatePurchasePaidBySession } from '@/server/services/template-payment.service'

export async function POST(req: Request) {
  const signature = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!signature || !webhookSecret) {
    return Response.json({ error: 'Missing Stripe webhook configuration' }, { status: 400 })
  }

  const rawBody = await req.text()
  const stripe = getStripe()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid signature'
    return Response.json({ error: message }, { status: 400 })
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

  if (event.type === 'checkout.session.completed') {
    const checkout = event.data.object as Stripe.Checkout.Session
    const metadataType = checkout.metadata?.type
    if (metadataType === 'template_purchase' && checkout.id) {
      await markTemplatePurchasePaidBySession(
        checkout.id,
        typeof checkout.payment_intent === 'string' ? checkout.payment_intent : undefined
      )
    }
    if (metadataType === 'creator_subscription' && checkout.id) {
      await markCreatorSubscriptionActiveByCheckoutSession(
        checkout.id,
        typeof checkout.subscription === 'string' ? checkout.subscription : undefined
      )
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription
    if (!subscription.id) {
      return Response.json({ ok: true })
    }
    const status =
      subscription.status === 'active'
        ? CreatorSubscriptionStatus.ACTIVE
        : subscription.status === 'past_due'
          ? CreatorSubscriptionStatus.PAST_DUE
          : CreatorSubscriptionStatus.CANCELLED
    await updateCreatorSubscriptionByStripeId(subscription.id, status)
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    if (subscription.id) {
      await updateCreatorSubscriptionByStripeId(subscription.id, CreatorSubscriptionStatus.CANCELLED)
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    if (paymentIntent.id) {
      await prisma.templatePurchase.updateMany({
        where: { stripePaymentIntent: paymentIntent.id },
        data: { status: PurchaseStatus.FAILED },
      })
    }
  }

  if (event.type === 'charge.refunded') {
    const charge = event.data.object as Stripe.Charge
    if (typeof charge.payment_intent === 'string') {
      await prisma.templatePurchase.updateMany({
        where: { stripePaymentIntent: charge.payment_intent },
        data: { status: PurchaseStatus.REFUNDED },
      })
    }
  }

  await prisma.stripeWebhookEvent.update({
    where: { id: event.id },
    data: { processed: true },
  })

  return Response.json({ ok: true })
}
