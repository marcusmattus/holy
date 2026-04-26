import crypto from 'crypto'
import { getVectorProvider } from '@/server/search/vector/vector-provider-factory'

export interface MarketplaceAssetIndexInput {
  id: string
  tenantId: string
  text: string
  keywords: string[]
  visibility: 'public' | 'private'
  approved: boolean
}

const contentHashes = new Set<string>()

export async function indexMarketplaceAsset(input: MarketplaceAssetIndexInput) {
  if (!input.approved) {
    return { indexed: false, reason: 'asset-not-approved' }
  }

  if (input.visibility === 'private' && input.tenantId === 'public') {
    return { indexed: false, reason: 'invalid-tenant-isolation' }
  }

  const contentHash = crypto
    .createHash('sha256')
    .update(`${input.id}:${input.tenantId}:${input.text}`)
    .digest('hex')

  if (contentHashes.has(contentHash)) {
    return { indexed: false, reason: 'duplicate-content' }
  }

  contentHashes.add(contentHash)

  const provider = getVectorProvider()
  await provider.upsert({
    id: input.id,
    tenantId: input.tenantId,
    text: `${input.text}\n${input.keywords.join(' ')}`,
    embedding: fakeEmbedding(input.text),
    contentHash,
    metadata: {
      visibility: input.visibility,
      approved: input.approved,
    },
  })

  return { indexed: true, contentHash }
}

function fakeEmbedding(input: string): number[] {
  return input
    .slice(0, 32)
    .split('')
    .map((char) => char.charCodeAt(0) / 255)
}
