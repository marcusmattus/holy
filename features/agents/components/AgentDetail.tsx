import { AgentConfigPanel } from '@/features/agents/components/AgentConfigPanel'
import { AgentInstallButton } from '@/features/agents/components/AgentInstallButton'
import { AgentRunHistory } from '@/features/agents/components/AgentRunHistory'

type AgentDetailProps = {
  agent: {
    id: string
    slug: string
    title: string
    description: string
    category: string
    priceType: string
    priceCents: number
    configSchema: unknown
    defaultConfig: unknown
    status: string
  }
}

export function AgentDetail({ agent }: AgentDetailProps) {
  const isPaid = agent.priceType !== 'FREE'
  const price = isPaid ? `£${(agent.priceCents / 100).toFixed(2)}` : 'Free'
  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-[#C9A24A]/30 bg-[#0A0A0A]/80 p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border border-[#C9A24A]/40 px-2 py-1 text-[#C9A24A]">
            {agent.category}
          </span>
          <span className="rounded-full border border-white/20 px-2 py-1">{agent.status}</span>
          <span className="rounded-full border border-white/20 px-2 py-1">{price}</span>
        </div>
        <h1 className="mt-3 text-2xl font-semibold">{agent.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{agent.description}</p>
        <div className="mt-5">
          <AgentInstallButton listingSlug={agent.slug} />
        </div>
      </section>
      <AgentConfigPanel schema={agent.configSchema} defaultConfig={agent.defaultConfig} />
      <AgentRunHistory />
    </div>
  )
}
