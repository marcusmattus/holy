import { NextResponse } from 'next/server'
import { getSamlLoginUrl } from '@/server/services/saml-auth.service'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ workspaceSlug: string }> }
) {
  const { workspaceSlug } = await params
  return NextResponse.redirect(getSamlLoginUrl(workspaceSlug))
}
