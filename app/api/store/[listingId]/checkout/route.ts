import { NextResponse } from 'next/server'
import { createStoreCheckoutSession } from '@/server/services/payment.service'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ listingId: string }> }
) {
  const body = await req.json()
  const { listingId } = await params

  if (!body?.buyerId || typeof body.buyerId !== 'string') {
    return NextResponse.json({ error: 'Missing buyerId' }, { status: 400 })
  }

  const result = await createStoreCheckoutSession({
    listingId,
    buyerId: body.buyerId,
    referralCode: typeof body.referralCode === 'string' ? body.referralCode : undefined,
  })

  return NextResponse.json(result)
}
