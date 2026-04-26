import { NextResponse } from 'next/server'
import { searchMarketplace } from '@/server/services/marketplace-search.service'
import { getActor } from '@/server/services/access-control.service'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q') ?? ''
  const type = searchParams.get('type') as
    | 'StoreListing'
    | 'Template'
    | 'AgentListing'
    | 'WorkflowTemplate'
    | 'CreatorProfile'
    | 'IntegrationListing'
    | null

  const results = await searchMarketplace({
    query,
    type: type ?? undefined,
    actor: getActor(req.headers),
  })

  return NextResponse.json({ results })
}
