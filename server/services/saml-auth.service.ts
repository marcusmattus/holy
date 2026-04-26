import { auditLog } from '@/server/observability/logger'
import { buildWorkspaceSamlConfig, generateMetadataXml } from '@/server/auth/saml.client'
import crypto from 'node:crypto'

export function getWorkspaceSamlMetadata(workspaceSlug: string) {
  return generateMetadataXml(buildWorkspaceSamlConfig(workspaceSlug))
}

export function getSamlLoginUrl(workspaceSlug: string) {
  const config = buildWorkspaceSamlConfig(workspaceSlug)
  return `${config.entityId}/login?acs=${encodeURIComponent(config.acsUrl)}`
}

type SamlPayload = {
  email: string
  name?: string
  assertion?: string
  signature?: string
}

function isSamlPayload(payload: unknown): payload is SamlPayload {
  return Boolean(
    payload &&
      typeof payload === 'object' &&
      typeof (payload as { email?: unknown }).email === 'string'
  )
}

export function handleSamlCallback(workspaceSlug: string, payload: unknown) {
  if (!isSamlPayload(payload)) {
    auditLog({ action: 'saml.login.failed', actor: 'anonymous', resource: workspaceSlug })
    throw new Error('Invalid SAML callback payload')
  }

  if (!payload.assertion) {
    auditLog({ action: 'saml.login.failed', actor: payload.email, resource: workspaceSlug })
    throw new Error('Missing SAML assertion')
  }

  if (
    process.env.SAML_ASSERTION_SHARED_SECRET &&
    !isValidSharedSecret(payload.signature ?? '', process.env.SAML_ASSERTION_SHARED_SECRET)
  ) {
    auditLog({ action: 'saml.login.failed', actor: payload.email, resource: workspaceSlug })
    throw new Error('SAML assertion signature validation failed')
  }

  const email = payload.email
  const name = payload.name ?? email

  if (!email.includes('@')) {
    auditLog({ action: 'saml.login.failed', actor: 'anonymous', resource: workspaceSlug })
    throw new Error('Invalid SAML assertion')
  }

  const domainPolicy = process.env.SAML_ALLOWED_DOMAIN
  if (domainPolicy && !email.endsWith(`@${domainPolicy}`)) {
    auditLog({ action: 'saml.login.failed', actor: email, resource: workspaceSlug })
    throw new Error('Workspace domain policy violation')
  }

  auditLog({ action: 'saml.login.success', actor: email, resource: workspaceSlug })
  return { workspaceSlug, user: { email, name } }
}

function isValidSharedSecret(signature: string, secret: string) {
  const provided =
    signature.includes('=') || /^[A-Za-z0-9+/]+$/.test(signature)
      ? Buffer.from(signature, 'base64')
      : Buffer.from(signature)
  const expected = Buffer.from(secret)
  if (provided.length !== expected.length) {
    return false
  }

  return crypto.timingSafeEqual(provided, expected)
}
