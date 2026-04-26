const INTEGRATIONS = [
  'GitHub',
  'Vercel',
  'Stripe',
  'Slack Webhook',
  'Discord Webhook',
  'Generic Webhook',
  'Analytics Export Webhook',
]

export function IntegrationGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {INTEGRATIONS.map((integration) => (
        <div key={integration} className="rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] p-4 text-sm text-[#F8FAFC]">
          {integration}
        </div>
      ))}
    </div>
  )
}
