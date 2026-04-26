import { SignJWT, decodeJwt, jwtVerify } from 'jose'
import { prisma } from '@/server/db'
import {
  createOidcSessionState,
  discoverOidcConfiguration,
  hashSessionState,
} from '@/server/auth/oidc.client'

const OIDC_STATE_SECRET = process.env.OIDC_STATE_SECRET ?? 'dev-oidc-state-secret'

function getCallbackUrl(workspaceSlug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  return `${baseUrl}/api/auth/enterprise/${workspaceSlug}/callback`
}

export async function getEnterpriseLoginUrl(workspaceSlug: string) {
  const workspace = await prisma.workspace.findUnique({
    where: { slug: workspaceSlug },
    include: { memberships: true },
  })
  if (!workspace) throw new Error('Workspace not found')

  const connection = await prisma.enterpriseConnection.findUnique({
    where: { workspaceId: workspace.id },
  })
  if (!connection) throw new Error('Enterprise OIDC is not configured')

  const stateData = await createOidcSessionState()
  const stateToken = await new SignJWT({
    workspaceId: workspace.id,
    state: hashSessionState(stateData.state),
    nonce: stateData.nonce,
    codeVerifier: stateData.codeVerifier,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('10m')
    .sign(new TextEncoder().encode(OIDC_STATE_SECRET))

  const oidc = await discoverOidcConfiguration(connection.issuerUrl)

  const loginUrl = new URL(oidc.authorization_endpoint)
  loginUrl.searchParams.set('client_id', connection.clientId)
  loginUrl.searchParams.set('redirect_uri', getCallbackUrl(workspace.slug))
  loginUrl.searchParams.set('response_type', 'code')
  loginUrl.searchParams.set('scope', 'openid email profile')
  loginUrl.searchParams.set('state', stateData.state)
  loginUrl.searchParams.set('nonce', stateData.nonce)
  loginUrl.searchParams.set('code_challenge', stateData.codeChallenge)
  loginUrl.searchParams.set('code_challenge_method', 'S256')

  return { loginUrl: loginUrl.toString(), stateToken }
}

export async function completeEnterpriseLogin(input: {
  workspaceSlug: string
  stateToken: string
  state: string
  code: string
  ipAddress?: string | null
  userAgent?: string | null
}) {
  const workspace = await prisma.workspace.findUnique({
    where: { slug: input.workspaceSlug },
  })
  if (!workspace) throw new Error('Workspace not found')

  const connection = await prisma.enterpriseConnection.findUnique({
    where: { workspaceId: workspace.id },
  })
  if (!connection) throw new Error('Enterprise OIDC is not configured')

  const verified = await jwtVerify(
    input.stateToken,
    new TextEncoder().encode(OIDC_STATE_SECRET),
  )

  const payload = verified.payload as {
    workspaceId: string
    state: string
    nonce: string
    codeVerifier: string
  }

  if (payload.workspaceId !== workspace.id || payload.state !== hashSessionState(input.state)) {
    throw new Error('Invalid OIDC state')
  }

  const oidc = await discoverOidcConfiguration(connection.issuerUrl)
  const tokenResponse = await fetch(oidc.token_endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: input.code,
      client_id: connection.clientId,
      client_secret: connection.clientSecret,
      redirect_uri: getCallbackUrl(workspace.slug),
      code_verifier: payload.codeVerifier,
    }),
  })

  if (!tokenResponse.ok) {
    throw new Error('OIDC token exchange failed')
  }

  const tokenPayload = (await tokenResponse.json()) as {
    id_token?: string
    access_token?: string
  }

  let email: string | undefined
  if (tokenPayload.id_token) {
    const claims = decodeJwt(tokenPayload.id_token) as { email?: string; nonce?: string }
    if (claims.nonce && claims.nonce !== payload.nonce) {
      throw new Error('OIDC nonce validation failed')
    }
    email = claims.email
  }

  if (!email && tokenPayload.access_token && oidc.userinfo_endpoint) {
    const userInfoResponse = await fetch(oidc.userinfo_endpoint, {
      headers: { authorization: `Bearer ${tokenPayload.access_token}` },
    })

    if (userInfoResponse.ok) {
      const userInfo = (await userInfoResponse.json()) as { email?: string }
      email = userInfo.email
    }
  }

  if (!email) throw new Error('OIDC response is missing email')

  if (workspace.emailDomain && !email.endsWith(`@${workspace.emailDomain}`)) {
    throw new Error('Email domain is not allowed for workspace')
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email },
  })

  await prisma.workspaceMembership.upsert({
    where: { workspaceId_userId: { workspaceId: workspace.id, userId: user.id } },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: user.id,
      role: 'MEMBER',
    },
  })

  await prisma.enterpriseLoginAudit.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      email,
      ipAddress: input.ipAddress ?? undefined,
      userAgent: input.userAgent ?? undefined,
      event: 'OIDC_LOGIN_SUCCESS',
    },
  })

  return { workspaceId: workspace.id, userId: user.id, email }
}
