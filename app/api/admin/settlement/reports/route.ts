import { NextResponse } from 'next/server'
import { getSettlementPilotReport } from '@/server/services/settlement-reporting.service'

export async function GET() {
  const report = await getSettlementPilotReport()
  return NextResponse.json({ report, visibility: 'internal' })
}
