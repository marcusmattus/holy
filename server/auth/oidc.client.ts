import { createHash } from 'node:crypto'
import {
  calculatePKCECodeChallenge,
  randomNonce,
  randomPKCECodeVerifier,
  randomState,
} from 'openid-client'

export type OidcDiscoveryDocument = {
  issuer: string
  authorization_endpoint: string
  token_endpoint: string
  userinfo_endpoint?: string
}

export async function discoverOidcConfiguration(issuerUrl: string): Promise<OidcDiscoveryDocument> {
  const normalized = issuerUrl.replace(/\/$/, '')
  const response = await fetch(`${normalized}/.well-known/openid-configuration`)
  if (!response.ok) {
    throw new Error('Unable to discover OIDC configuration')
  }

  return (await response.json()) as OidcDiscoveryDocument
}

export async function createOidcSessionState() {
  const codeVerifier = randomPKCECodeVerifier()
  return {
    state: randomState(),
    nonce: randomNonce(),
    codeVerifier,
    codeChallenge: await calculatePKCECodeChallenge(codeVerifier),
  }
}

export function hashSessionState(value: string) {
  return createHash('sha256').update(value).digest('hex')
}
