import { NextResponse } from 'next/server'
import { handleSamlCallback } from '@/server/services/saml-auth.service'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ workspaceSlug: string }> }
) {
  try {
    const { workspaceSlug } = await params
    const body = await req.json()
    return NextResponse.json(handleSamlCallback(workspaceSlug, body))
  } catch {
    return NextResponse.json({ error: 'SAML authentication failed' }, { status: 400 })
  }
}
