import { AgentMarketplaceGrid } from '@/features/agents/components/AgentMarketplaceGrid'
import { listPublishedAgentListings } from '@/server/services/agent-marketplace.service'

export const metadata = { title: 'Agents Marketplace — Holy' }
export const dynamic = 'force-dynamic'

export default async function AgentsMarketplacePage() {
  const agents = await listPublishedAgentListings()

  return (
    <main className="space-y-6">
      <section className="rounded-xl border border-[#C9A24A]/30 bg-[#0A0A0A]/80 p-6">
        <h1 className="text-3xl font-semibold">Agent Marketplace</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Install curated agents to automate growth, QA, SEO, analytics, and compliance.
        </p>
      </section>
      <AgentMarketplaceGrid agents={agents} />
    </main>
  )
}
