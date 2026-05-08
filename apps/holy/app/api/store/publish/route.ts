import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      projectId,
      shortDescription,
      longDescription,
      demoUrl,
      category,
      pricingModel,
      price,
    } = body

    if (!projectId || !shortDescription || !category) {
      return NextResponse.json(
        { error: 'projectId, shortDescription, and category are required' },
        { status: 400 },
      )
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { storeEntry: true },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // If already has a store entry, update it
    if (project.storeEntry) {
      const updated = await prisma.storeEntry.update({
        where: { projectId },
        data: {
          longDescription: longDescription || null,
          demoUrl: demoUrl || null,
          status: 'IN_REVIEW',
          submittedAt: new Date(),
        },
      })

      // Update project category and price
      await prisma.project.update({
        where: { id: projectId },
        data: {
          category,
          storePrice: price ?? 0,
        },
      })

      return NextResponse.json({ storeEntry: updated })
    }

    // Create new store entry
    const storeEntry = await prisma.storeEntry.create({
      data: {
        projectId,
        longDescription: longDescription || null,
        demoUrl: demoUrl || null,
        status: 'IN_REVIEW',
        submittedAt: new Date(),
      },
    })

    // Update project with category and pricing
    await prisma.project.update({
      where: { id: projectId },
      data: {
        category,
        storePrice: pricingModel !== 'free' ? (price ?? 0) : 0,
      },
    })

    return NextResponse.json({ storeEntry }, { status: 201 })
  } catch (error) {
    console.error('Publish error:', error)
    return NextResponse.json(
      { error: 'Failed to submit listing' },
      { status: 500 },
    )
  }
}
