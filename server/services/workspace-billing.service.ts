import { getAppBaseUrl, getStripe } from '@/server/payments/stripe'

export type WorkspacePlan = 'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE'

const PLAN_LIMITS: Record<WorkspacePlan, { seats: number; generations: number }> = {
  FREE: { seats: 1, generations: 20 },
  PRO: { seats: 1, generations: 500 },
  TEAM: { seats: 20, generations: 3000 },
  ENTERPRISE: { seats: 500, generations: 20000 },
}

const PLAN_PRICES: Record<WorkspacePlan, number> = {
  FREE: 0,
  PRO: 1900,
  TEAM: 4900,
  ENTERPRISE: 0,
}
const BILLING_CURRENCY = process.env.BILLING_CURRENCY ?? 'gbp'

export async function createWorkspaceCheckoutSession(workspaceId: string, plan: WorkspacePlan) {
  const stripe = getStripe()
  if (PLAN_PRICES[plan] === 0) {
    return {
      workspaceId,
      plan,
      checkoutUrl: null,
      limits: PLAN_LIMITS[plan],
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    success_url: `${getAppBaseUrl()}/dashboard/settings?workspaceBilling=success`,
    cancel_url: `${getAppBaseUrl()}/dashboard/settings?workspaceBilling=cancelled`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: BILLING_CURRENCY,
          recurring: { interval: 'month' },
          unit_amount: PLAN_PRICES[plan],
          product_data: { name: `Workspace ${plan} plan` },
        },
      },
    ],
    metadata: {
      type: 'workspace_billing',
      workspaceId,
      plan,
    },
  })

  return {
    workspaceId,
    plan,
    checkoutUrl: session.url,
    stripeSessionId: session.id,
    limits: PLAN_LIMITS[plan],
  }
}

export async function createWorkspaceBillingPortal(workspaceId: string, customerId: string) {
  const stripe = getStripe()
  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${getAppBaseUrl()}/dashboard/settings`,
  })

  return {
    workspaceId,
    portalUrl: portal.url,
  }
}

export function getWorkspacePlanLimits(plan: WorkspacePlan) {
  return PLAN_LIMITS[plan]
}
