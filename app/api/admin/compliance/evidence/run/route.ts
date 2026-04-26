import { NextResponse } from 'next/server'
import { runComplianceEvidenceAutomation } from '@/server/services/compliance-evidence-automation.service'
import { assertAdmin } from '@/server/security'

export async function POST(request: Request) {
  try {
    assertAdmin(request)
    const evidence = await runComplianceEvidenceAutomation()
    return NextResponse.json({ evidence })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unauthorized' }, { status: 403 })
  }
}
