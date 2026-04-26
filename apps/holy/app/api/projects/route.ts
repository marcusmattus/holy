import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { CreateProjectInput } from '@/types/project'

// GET /api/projects - List all projects for the current user
export async function GET(request: NextRequest) {
  try {
    // TODO: Get userId from session/auth
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') // Temporary: will come from auth

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        _count: {
          select: { versions: true }
        },
        storeEntry: {
          select: {
            status: true,
            installs: true,
            avgRating: true,
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateProjectInput & { userId: string }
    
    const { name, slug, description, category, userId, holyosProjectId } = body

    if (!name || !slug || !userId) {
      return NextResponse.json(
        { error: 'Name, slug, and userId are required' },
        { status: 400 }
      )
    }

    // Check if slug is already taken
    const existingProject = await prisma.project.findUnique({
      where: { slug }
    })

    if (existingProject) {
      return NextResponse.json(
        { error: 'Project with this slug already exists' },
        { status: 409 }
      )
    }

    const project = await prisma.project.create({
      data: {
        name,
        slug,
        description,
        category,
        userId,
        holyosProjectId: holyosProjectId || `holyos_${slug}_${Date.now()}`,
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

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
