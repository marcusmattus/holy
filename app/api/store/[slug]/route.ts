import { NextResponse } from 'next/server'
import { getListingBySlug } from '@/server/services/store.service'

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const listing = await getListingBySlug(slug)

  if (!listing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ listing })
}
