import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe() {
  if (stripeInstance) return stripeInstance
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('Missing required environment variable STRIPE_SECRET_KEY')
  }
  stripeInstance = new Stripe(secretKey)
  return stripeInstance
}

export function getAppBaseUrl() {
  return process.env.APP_URL ?? 'http://localhost:3000'
}
