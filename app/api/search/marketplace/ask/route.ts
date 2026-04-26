import { NextResponse } from 'next/server'
import { askMarketplaceDiscovery } from '@/server/services/marketplace-discovery-agent.service'

export async function POST(request: Request) {
  const body = (await request.json()) as {
    tenantId?: string
    question?: string
    assetType?: 'app' | 'template' | 'agent' | 'workflow' | 'plugin' | 'integration'
  }

  if (!body.question) {
    return NextResponse.json({ error: 'question is required' }, { status: 400 })
  }

  const response = await askMarketplaceDiscovery({
    tenantId: body.tenantId ?? 'public',
    question: body.question,
    assetType: body.assetType,
  })

  return NextResponse.json(response)
}
