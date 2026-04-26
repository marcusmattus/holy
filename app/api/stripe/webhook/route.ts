import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/server/stripe/client'
import { env } from '@/lib/env'
import { prisma } from '@/server/db/client'

export async function POST(req: Request) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook secret is not configured' }, { status: 500 })
  }

  const signature = (await headers()).get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const body = await req.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid webhook signature' },
      { status: 400 },
    )
  }

  const existing = await prisma.stripeWebhookEvent.findUnique({
    where: { eventId: event.id },
  })

  if (existing) {
    return NextResponse.json({ received: true, deduped: true })
  }

  await prisma.stripeWebhookEvent.create({
    data: {
      eventId: event.id,
      type: event.type,
    },
  })

  return NextResponse.json({ received: true })
}
