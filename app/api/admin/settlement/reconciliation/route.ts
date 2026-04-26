import { NextResponse } from 'next/server'
import { runSettlementReconciliation } from '@/server/protocol/settlement-reconciliation'

export async function POST() {
  return NextResponse.json(runSettlementReconciliation())
}
