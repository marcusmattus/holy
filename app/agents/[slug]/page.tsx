import { notFound } from 'next/navigation'
import { AgentDetail } from '@/features/agents/components/AgentDetail'
import { getAgentListingBySlug } from '@/server/services/agent-marketplace.service'

export const dynamic = 'force-dynamic'

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const agent = await getAgentListingBySlug(slug)
  if (!agent) notFound()

  return <AgentDetail agent={agent} />
}
