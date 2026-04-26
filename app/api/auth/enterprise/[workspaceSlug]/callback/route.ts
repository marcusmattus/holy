import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { completeEnterpriseLogin } from '@/server/services/enterprise-auth.service'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ workspaceSlug: string }> },
) {
  const { workspaceSlug } = await params
  const url = new URL(request.url)
  const state = url.searchParams.get('state')
  const code = url.searchParams.get('code')

  if (!state || !code) {
    return NextResponse.json({ error: 'Missing OIDC state or code' }, { status: 400 })
  }

  const cookieStore = await cookies()
  const stateToken = cookieStore.get('holy-oidc-state')?.value

  if (!stateToken) {
    return NextResponse.json({ error: 'OIDC session state missing' }, { status: 400 })
  }

  const result = await completeEnterpriseLogin({
    workspaceSlug,
    stateToken,
    state,
    code,
    ipAddress: request.headers.get('x-forwarded-for'),
    userAgent: request.headers.get('user-agent'),
  })

  return NextResponse.json(result)
}
