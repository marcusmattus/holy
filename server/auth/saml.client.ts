export type WorkspaceSamlConfig = {
  workspaceSlug: string
  entityId: string
  acsUrl: string
  certificate?: string
}

export function buildWorkspaceSamlConfig(workspaceSlug: string): WorkspaceSamlConfig {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  return {
    workspaceSlug,
    entityId: `${baseUrl}/auth/saml/${workspaceSlug}`,
    acsUrl: `${baseUrl}/api/auth/saml/${workspaceSlug}/callback`,
    certificate: process.env.SAML_X509_CERT,
  }
}

export function generateMetadataXml(config: WorkspaceSamlConfig) {
  return `<?xml version="1.0"?><EntityDescriptor entityID="${config.entityId}"><SPSSODescriptor><AssertionConsumerService Location="${config.acsUrl}"/></SPSSODescriptor></EntityDescriptor>`
}
