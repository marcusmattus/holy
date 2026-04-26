import {
  AgentCategory,
  AgentInstallStatus,
  AgentListingStatus,
  AgentType,
  type Prisma,
  PriceType,
  PurchaseStatus,
} from '@prisma/client'
import { prisma } from '@/server/services/prisma'

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function validateConfig(
  configSchema: unknown,
  config: Record<string, unknown> | undefined,
) {
  if (!configSchema || !config) return
  if (typeof configSchema !== 'object' || Array.isArray(configSchema)) return
  const schemaObject = configSchema as Record<string, unknown>
  const properties =
    typeof schemaObject.properties === 'object' &&
    schemaObject.properties &&
    !Array.isArray(schemaObject.properties)
      ? (schemaObject.properties as Record<string, unknown>)
      : {}
  const required =
    Array.isArray(schemaObject.required) &&
    schemaObject.required.every((value) => typeof value === 'string')
      ? (schemaObject.required as string[])
      : []

  for (const key of required) {
    if (!(key in config)) {
      throw new Error(`Missing required config field: ${key}`)
    }
  }

  for (const key of Object.keys(config)) {
    if (Object.keys(properties).length > 0 && !(key in properties)) {
      throw new Error(`Unsupported config field: ${key}`)
    }
  }
}

export async function publishAgentListing(input: {
  creatorId: string
  title: string
  description: string
  category?: AgentCategory
  type?: AgentType
  slug?: string
  configSchema?: Record<string, unknown>
  defaultConfig?: Record<string, unknown>
  priceType?: PriceType
  priceCents?: number
}) {
  const slug = input.slug ? toSlug(input.slug) : toSlug(input.title)
  return prisma.agentListing.create({
    data: {
      creatorId: input.creatorId,
      title: input.title,
      slug,
      description: input.description,
      category: input.category ?? AgentCategory.CUSTOM,
      type: input.type ?? AgentType.AUTOMATION,
      configSchema: input.configSchema as Prisma.InputJsonValue | undefined,
      defaultConfig: input.defaultConfig as Prisma.InputJsonValue | undefined,
      priceType: input.priceType ?? PriceType.FREE,
      priceCents: input.priceCents ?? 0,
      status: AgentListingStatus.PUBLISHED,
    },
  })
}

export async function listPublishedAgentListings() {
  return prisma.agentListing.findMany({
    where: { status: AgentListingStatus.PUBLISHED },
    orderBy: { createdAt: 'desc' },
    include: {
      reviews: { select: { rating: true } },
      installs: { select: { id: true } },
    },
  })
}

export async function getAgentListingBySlug(slug: string) {
  return prisma.agentListing.findUnique({
    where: { slug },
    include: {
      reviews: true,
    },
  })
}

export async function installAgentListing(input: {
  agentListingId: string
  userId: string
  workspaceId?: string
  config?: Record<string, unknown>
}) {
  const listing = await prisma.agentListing.findUnique({
    where: { id: input.agentListingId },
  })
  if (!listing) throw new Error('Agent listing not found')
  if (listing.status !== AgentListingStatus.PUBLISHED) {
    throw new Error('Agent listing is not published')
  }

  validateConfig(listing.configSchema, input.config)

  if (input.workspaceId) {
    const workspace = await prisma.workspace.findFirst({
      where: { id: input.workspaceId, ownerId: input.userId },
      select: { id: true },
    })
    if (!workspace) {
      throw new Error('Workspace authorization failed')
    }
  }

  if (listing.priceType !== PriceType.FREE) {
    const purchase = await prisma.agentPurchase.findFirst({
      where: {
        agentListingId: listing.id,
        buyerId: input.userId,
        status: PurchaseStatus.COMPLETED,
      },
      select: { id: true },
    })
    if (!purchase) {
      throw new Error('Purchase required before install')
    }
  }

  const install = await prisma.agentInstall.create({
    data: {
      agentListingId: listing.id,
      userId: input.userId,
      workspaceId: input.workspaceId,
      config: (input.config ?? listing.defaultConfig ?? undefined) as
        | Prisma.InputJsonValue
        | undefined,
      status: AgentInstallStatus.ACTIVE,
    },
  })

  const agent = await prisma.agent.create({
    data: {
      title: listing.title,
      listingId: listing.id,
      installId: install.id,
      userId: input.userId,
      workspaceId: input.workspaceId,
      config: (input.config ?? listing.defaultConfig ?? undefined) as
        | Prisma.InputJsonValue
        | undefined,
    },
  })

  await prisma.analyticsEvent.create({
    data: {
      workspaceId: input.workspaceId,
      event: 'agent_installed',
      metadata: {
        agentListingId: listing.id,
        agentInstallId: install.id,
        agentId: agent.id,
        priceType: listing.priceType,
      },
    },
  })

  return { install, agent }
}
