import { NextResponse } from 'next/server'
import { resolveReferral } from '@/server/services/growth.service'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params
  const referral = await resolveReferral(code).catch(() => null)
  if (!referral) {
    return NextResponse.json({ error: 'Referral not found' }, { status: 404 })
  }
  return NextResponse.json({ referral })
}
