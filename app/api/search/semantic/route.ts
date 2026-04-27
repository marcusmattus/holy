import { semanticMarketplaceSearch } from '@/server/services/semantic-search.service'

export async function POST(req: Request) {
  const body = await req.json()
  const query = typeof body.query === 'string' ? body.query : ''

  if (!query.trim()) {
    return Response.json({ error: 'query is required' }, { status: 400 })
  }

  const results = await semanticMarketplaceSearch(query)
  return Response.json({ query, results })
}
