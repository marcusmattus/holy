export type WorkspacePlan = 'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE'

const PLAN_LIMITS: Record<WorkspacePlan, { seats: number; generations: number }> = {
  FREE: { seats: 1, generations: 20 },
  PRO: { seats: 1, generations: 500 },
  TEAM: { seats: 20, generations: 3000 },
  ENTERPRISE: { seats: 500, generations: 20000 },
}

export function createWorkspaceCheckoutSession(workspaceId: string, plan: WorkspacePlan) {
  return {
    workspaceId,
    plan,
    checkoutUrl: `https://checkout.stripe.com/pay/ws_${workspaceId}_${plan.toLowerCase()}`,
    limits: PLAN_LIMITS[plan],
  }
}

export function createWorkspaceBillingPortal(workspaceId: string) {
  return {
    workspaceId,
    portalUrl: `https://billing.stripe.com/p/session/${workspaceId}`,
  }
}

export function getWorkspacePlanLimits(plan: WorkspacePlan) {
  return PLAN_LIMITS[plan]
}
