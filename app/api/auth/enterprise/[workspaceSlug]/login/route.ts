import { NextResponse } from 'next/server'
import { getEnterpriseLoginUrl } from '@/server/services/enterprise-auth.service'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ workspaceSlug: string }> },
) {
  const { workspaceSlug } = await params
  const session = await getEnterpriseLoginUrl(workspaceSlug)

  const response = NextResponse.redirect(session.loginUrl)
  response.cookies.set('holy-oidc-state', session.stateToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 10 * 60,
  })

  return response
}
