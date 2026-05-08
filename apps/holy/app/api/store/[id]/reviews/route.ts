import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

type RouteContext = {
  params: Promise<{ id: string }>
}

// POST /api/store/[id]/reviews - Add a review
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id: storeEntryId } = await context.params
    const body = await request.json()
    const { userId, rating, comment } = body

    if (!userId || !rating) {
      return NextResponse.json(
        { error: 'User ID and rating are required' },
        { status: 400 },
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 },
      )
    }

    // Check if store entry exists
    const storeEntry = await prisma.storeEntry.findUnique({
      where: { id: storeEntryId },
    })

    if (!storeEntry) {
      return NextResponse.json(
        { error: 'Store entry not found' },
        { status: 404 },
      )
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        storeEntryId,
        userId,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    })

    // Update store entry stats
    const allReviews = await prisma.review.findMany({
      where: { storeEntryId },
    })

    type ReviewRow = (typeof allReviews)[number]
    const avgRating =
      allReviews.reduce((sum: number, r: ReviewRow) => sum + r.rating, 0) / allReviews.length
    const reviewCount = allReviews.length

    await prisma.storeEntry.update({
      where: { id: storeEntryId },
      data: {
        avgRating,
        reviewCount,
      },
    })

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 },
    )
  }
}
