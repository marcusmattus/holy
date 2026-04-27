import { NextResponse } from 'next/server'
import { generateSettlementAuditExport } from '@/server/protocol/settlement-audit-export'

export async function POST(req: Request) {
  const body = await req.json()
  try {
    return NextResponse.json(generateSettlementAuditExport(Boolean(body.adminApproved)))
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 403 })
  }
}
