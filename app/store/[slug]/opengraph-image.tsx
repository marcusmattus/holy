import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (value) => value.toUpperCase())

  return new ImageResponse(
    (
      <div
        style={{
          background: '#08080B',
          color: '#F8FAFC',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: 6, textTransform: 'uppercase', opacity: 0.7 }}>
          Holy Store
        </div>
        <div style={{ marginTop: 24, fontSize: 64, fontWeight: 700 }}>{title}</div>
      </div>
    ),
    size,
  )
}
