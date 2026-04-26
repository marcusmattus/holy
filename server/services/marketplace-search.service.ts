import { auditLog } from '@/server/observability/logger'
import { PostgresSearchProvider } from '@/server/search/providers/postgres-search.provider'

const provider = new PostgresSearchProvider()

export async function searchMarketplace(params: {
  query: string
  actor: string
  type?: 'StoreListing' | 'Template' | 'AgentListing' | 'WorkflowTemplate' | 'CreatorProfile' | 'IntegrationListing'
}) {
  const results = await provider.searchMarketplace(params.query, { type: params.type })
  auditLog({
    action: 'marketplace.search',
    actor: params.actor,
    metadata: { query: params.query, type: params.type, count: results.length },
  })

  return results
}
