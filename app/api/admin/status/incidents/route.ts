import { NextResponse } from 'next/server'
import { createPublicIncident } from '@/server/services/public-status.service'

export async function POST(req: Request) {
  const body = await req.json()
  try {
    return NextResponse.json(createPublicIncident(body))
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
