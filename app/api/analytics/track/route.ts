import { NextResponse } from 'next/server'
import { trackEvent } from '@/server/services/analytics.service'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const event = await trackEvent(body)
    return NextResponse.json({ event })
  } catch {
    return NextResponse.json({ accepted: false }, { status: 202 })
  }
}
