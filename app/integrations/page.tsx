import { IntegrationGrid } from '@/features/integrations/components/IntegrationGrid'

export default function IntegrationsPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-8 text-[#F8FAFC]">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold">Integrations</h1>
        <p className="mt-2 text-sm text-[#A1A1AA]">
          Connect Holy with delivery, billing, messaging, and analytics systems.
        </p>
        <div className="mt-6">
          <IntegrationGrid />
        </div>
      </div>
    </main>
  )
}
