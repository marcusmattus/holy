import Stripe from 'stripe'
import { env } from '@/lib/env'

const stripeKey = env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder'

export const stripe = new Stripe(stripeKey)
