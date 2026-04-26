import { auditLog } from '@/server/observability/logger'
import { buildWorkspaceSamlConfig, generateMetadataXml } from '@/server/auth/saml.client'

export function getWorkspaceSamlMetadata(workspaceSlug: string) {
  return generateMetadataXml(buildWorkspaceSamlConfig(workspaceSlug))
}

export function getSamlLoginUrl(workspaceSlug: string) {
  const config = buildWorkspaceSamlConfig(workspaceSlug)
  return `${config.entityId}/login?acs=${encodeURIComponent(config.acsUrl)}`
}

export function handleSamlCallback(workspaceSlug: string, payload: Record<string, string>) {
  const email = payload.email ?? ''
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
