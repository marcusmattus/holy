import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/store - List all published store entries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'installs'

    const where: any = {
      status: 'PUBLISHED',
    }

    if (category) {
      where.project = { category }
    }

    if (search) {
      where.OR = [
        { project: { name: { contains: search, mode: 'insensitive' } } },
        { longDescription: { contains: search, mode: 'insensitive' } },
      ]
    }

    let orderBy: any = { installs: 'desc' }
    if (sort === 'rating') orderBy = { avgRating: 'desc' }
    if (sort === 'price') orderBy = { project: { storePrice: 'asc' } }
    if (sort === 'recent') orderBy = { publishedAt: 'desc' }

    const entries = await prisma.storeEntry.findMany({
      where,
      orderBy,
      include: {
        project: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ entries })
  } catch (error) {
    console.error('Error fetching store entries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch store entries' },
      { status: 500 },
    )
  }
}

// POST /api/store - Submit a project to the store
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, screenshots, longDescription, demoUrl } = body

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 },
      )
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const existingEntry = await prisma.storeEntry.findUnique({
      where: { projectId },
    })

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Project already submitted to store' },
        { status: 409 },
      )
    }

    const entry = await prisma.storeEntry.create({
      data: {
        projectId,
        screenshots: screenshots ? JSON.stringify(screenshots) : null,
        longDescription,
        demoUrl,
        status: 'IN_REVIEW',
        submittedAt: new Date(),
      },
      include: {
        project: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ entry }, { status: 201 })
  } catch (error) {
    console.error('Error submitting to store:', error)
    return NextResponse.json(
      { error: 'Failed to submit to store' },
      { status: 500 },
    )
  }
}
