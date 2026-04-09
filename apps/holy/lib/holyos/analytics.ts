export async function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  console.debug('[HolyOS Analytics]', event, properties)
}

export async function getMetrics(projectId: string) {
  return { views: 0, visitors: 0, revenue: 0, bounceRate: 0, projectId }
}
