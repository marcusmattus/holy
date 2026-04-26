import { NextResponse } from 'next/server'
import { stripe } from '@/server/stripe/client'
import { handleCheckoutSessionCompleted } from '@/server/stripe/webhooks'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    await handleCheckoutSessionCompleted(event.data.object)
  }

  return NextResponse.json({ received: true })
}
