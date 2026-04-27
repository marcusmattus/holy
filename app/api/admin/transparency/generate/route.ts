import { NextResponse } from 'next/server'
import { generateTransparencyReport } from '@/server/services/transparency-report.service'

export async function POST(req: Request) {
  const body = await req.json()
  return NextResponse.json(generateTransparencyReport(Boolean(body.approvedForPublish)))
}
