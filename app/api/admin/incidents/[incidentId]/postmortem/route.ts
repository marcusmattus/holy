import { NextResponse } from 'next/server'
import { generatePostmortemDraft } from '@/server/services/postmortem.service'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ incidentId: string }> },
) {
  const { incidentId } = await params
  const postmortem = await generatePostmortemDraft(incidentId)
  return NextResponse.json({ postmortem }, { status: 201 })
}
