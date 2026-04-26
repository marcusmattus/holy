import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripeClient } from '@/server/stripe/client'
import { prisma } from '@/server/db/client'
import { requireEnv } from '@/lib/env'

export async function POST(req: Request) {
  const { STRIPE_WEBHOOK_SECRET } = requireEnv(['STRIPE_WEBHOOK_SECRET'])
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const payload = await req.text()
  let event: Stripe.Event

  try {
    event = getStripeClient().webhooks.constructEvent(
      payload,
      signature,
      STRIPE_WEBHOOK_SECRET,
    )
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid signature' },
      { status: 400 },
    )
  }

  const exists = await prisma.stripeWebhookEvent.findUnique({
    where: { eventId: event.id },
  })

  if (exists) {
    return NextResponse.json({ ok: true, duplicate: true })
  }

  await prisma.stripeWebhookEvent.create({
    data: {
      eventId: event.id,
      eventType: event.type,
    },
  })

  return NextResponse.json({ ok: true })
}
