import Stripe from 'stripe'
import { requireEnv } from '@/lib/env'

let stripeClient: Stripe | null = null

export function getStripeClient() {
  if (!stripeClient) {
    const { STRIPE_SECRET_KEY } = requireEnv(['STRIPE_SECRET_KEY'])
    stripeClient = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2026-04-22.dahlia',
    })
  }

  return stripeClient
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return Reflect.get(getStripeClient(), prop)
  },

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-04-22.dahlia',
})
