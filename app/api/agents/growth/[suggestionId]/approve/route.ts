import { approveGrowthSuggestion } from '@/server/services/ai-growth.service'

type RouteParams = {
  params: Promise<{ suggestionId: string }>
}

export async function POST(_: Request, { params }: RouteParams) {
  const { suggestionId } = await params
  const suggestion = await approveGrowthSuggestion(suggestionId)
  return Response.json({ suggestion })
}
