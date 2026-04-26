import { notFound } from 'next/navigation'
import { prisma } from '@/server/db/client'
import { StoreListingClient } from '@/features/store/components/StoreListingClient'

export const dynamic = 'force-dynamic'

export default async function StoreListingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const listing = await prisma.storeListing
    .findUnique({
      where: { slug },
    })
    .catch(() => null)

  if (!listing || !listing.isPublished) {
    if (slug !== 'demo-app') {
      notFound()
    }

    return (
      <div className="max-w-4xl mx-auto p-6">
        <StoreListingClient
          listing={{
            id: 'demo-listing',
            projectId: 'demo-project',
            name: 'Demo App',
            description: 'Demo listing used when database is unavailable.',
            slug: 'demo-app',
            price: 0,
          }}
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <StoreListingClient
        listing={{
          id: listing.id,
          projectId: listing.projectId,
          name: listing.name,
          description: listing.description,
          slug: listing.slug,
          price: listing.price ?? 0,
        }}
      />
    </div>
  )
}
