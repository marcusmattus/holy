import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'

const DEFAULT_INTEGRATIONS = [
  {
    name: 'GitHub',
    slug: 'github',
    provider: 'GitHub',
    category: 'Development',
    description: 'Source control and CI integration',
  },
  {
    name: 'Vercel',
    slug: 'vercel',
    provider: 'Vercel',
    category: 'Hosting',
    description: 'Preview and production deployments',
  },
  {
    name: 'Stripe',
    slug: 'stripe',
    provider: 'Stripe',
    category: 'Billing',
    description: 'Payments and subscription billing',
  },
]

export async function GET() {
  const count = await prisma.integrationListing.count()
  if (count === 0) {
    await prisma.integrationListing.createMany({
      data: DEFAULT_INTEGRATIONS,
    })
  }

  const integrations = await prisma.integrationListing.findMany({
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(integrations)
}
