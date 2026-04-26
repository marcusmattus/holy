import { applyGrowthSuggestion } from '@/server/services/ai-growth.service'

type RouteParams = {
  params: Promise<{ suggestionId: string }>
}

export async function POST(_: Request, { params }: RouteParams) {
  const { suggestionId } = await params
  try {
    const suggestion = await applyGrowthSuggestion(suggestionId)
    return Response.json({ suggestion })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to apply suggestion'
    return Response.json({ error: message }, { status: 400 })
  }
}
