import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { UpdateProjectInput } from '@/types/project'

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/projects/[id] - Get a single project
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          }
        },
        versions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        storeEntry: {
          include: {
            reviews: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                  }
                }
              },
              orderBy: { createdAt: 'desc' },
              take: 5
            }
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PATCH /api/projects/[id] - Update a project
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body = await request.json() as UpdateProjectInput

    // Check if project exists and get current user
    const existingProject = await prisma.project.findUnique({
      where: { id }
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // TODO: Check if user owns this project (from auth session)

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          }
        }
      }
    })

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id }
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // TODO: Check if user owns this project (from auth session)

    // Delete project (cascade will handle versions and store entry)
    await prisma.project.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Project deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
