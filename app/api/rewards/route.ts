import { RewardKind } from '@prisma/client'
import { getRewardSummary, recordReward } from '@/server/services/rewards.service'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return Response.json({ error: 'userId is required' }, { status: 400 })
  }

  const summary = await getRewardSummary(userId)
  return Response.json({ summary })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { userId, amountCents, kind, projectId, listingId, note } = body

  if (!userId || typeof userId !== 'string') {
    return Response.json({ error: 'userId is required' }, { status: 400 })
  }
  if (typeof amountCents !== 'number') {
    return Response.json({ error: 'amountCents is required' }, { status: 400 })
  }
  if (!kind || !Object.values(RewardKind).includes(kind as RewardKind)) {
    return Response.json({ error: 'valid kind is required' }, { status: 400 })
  }

  const reward = await recordReward({
    userId,
    amountCents,
    kind: kind as RewardKind,
    projectId: typeof projectId === 'string' ? projectId : undefined,
    listingId: typeof listingId === 'string' ? listingId : undefined,
    note: typeof note === 'string' ? note : undefined,
  })

  return Response.json({ reward })
}
