import { runGrowthAgents } from '@/server/services/ai-growth.service'

export async function POST(req: Request) {
  const body = await req.json()
  const suggestions = await runGrowthAgents({
    projectId: body.projectId,
    listingId: body.listingId,
  })

  return Response.json({ suggestions })
}
