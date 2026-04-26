import Stripe from 'stripe'
import { env } from '@/lib/env'
import { logger } from '@/lib/logger'

const stripeKey = env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder'

if (!env.STRIPE_SECRET_KEY) {
  const isProductionRuntime =
    process.env.NODE_ENV === 'production' &&
    process.env.NEXT_PHASE !== 'phase-production-build'

  if (isProductionRuntime) {
    throw new Error('Missing required environment variable: STRIPE_SECRET_KEY')
  }

  logger.warn({
    event: 'stripe.client.placeholder_key',
    message: 'Using placeholder Stripe key in non-production environment',
  })
}

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2026-04-22.dahlia',
})
