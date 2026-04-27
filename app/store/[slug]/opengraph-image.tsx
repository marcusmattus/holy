import { ImageResponse } from 'next/og'
import { getStoreListingBySlug } from '@/server/services/store-listing.service'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const listing = await getStoreListingBySlug(slug)

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#0A0A0F',
          color: '#F8FAFC',
          padding: '64px',
          border: '1px solid #27272A',
        }}
      >
        <div style={{ color: '#D4AF37', letterSpacing: '0.16em', fontSize: 26 }}>HOLY STORE</div>
        <div style={{ marginTop: 20, fontSize: 68, fontWeight: 700 }}>
          {listing?.title ?? 'Holy Listing'}
        </div>
        <div style={{ marginTop: 16, fontSize: 30, color: '#A1A1AA' }}>
          {listing?.description ?? 'Build, monetize, and grow'}
        </div>
      </div>
    ),
    size,
  )
}
