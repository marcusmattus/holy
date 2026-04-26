import { AgentCard } from '@/features/agents/components/AgentCard'

type AgentListingLite = {
  id: string
  slug: string
  title: string
  description: string
  category: string
  priceType: string
  priceCents: number
}

function formatPrice(priceType: string, priceCents: number) {
  if (priceType === 'FREE') return 'Free'
  return `£${(priceCents / 100).toFixed(2)}`
}

export function AgentMarketplaceGrid({ agents }: { agents: AgentListingLite[] }) {
  if (agents.length === 0) {
    return (
      <div className="rounded-xl border border-[#C9A24A]/20 bg-[#0A0A0A]/70 p-6 text-sm text-muted-foreground">
        No published agents yet.
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          id={agent.id}
          slug={agent.slug}
          title={agent.title}
          description={agent.description}
          category={agent.category}
          priceLabel={formatPrice(agent.priceType, agent.priceCents)}
        />
      ))}
    </div>
  )
}
