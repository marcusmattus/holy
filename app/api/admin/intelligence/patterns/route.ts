import { NextResponse } from 'next/server'
import {
  ingestGlobalSignals,
  listGlobalPatternSignals,
} from '@/server/intelligence/global-patterns.service'

export async function GET() {
  const signals = await listGlobalPatternSignals()
  return NextResponse.json({ signals })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({ signals: [] }))
  const signals = await ingestGlobalSignals(body.signals ?? [])
  return NextResponse.json({ signals }, { status: 201 })
}
