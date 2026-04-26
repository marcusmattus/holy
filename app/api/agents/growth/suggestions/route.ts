import { listGrowthSuggestions } from '@/server/services/ai-growth.service'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const projectId = searchParams.get('projectId') ?? undefined
  const listingId = searchParams.get('listingId') ?? undefined
  const suggestions = await listGrowthSuggestions(projectId, listingId)
  return Response.json({ suggestions })
}
