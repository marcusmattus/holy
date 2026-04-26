import { NextResponse } from 'next/server'
import { createProject, getProjects } from '@/server/services/project.service'

export async function GET(req: Request) {
  const userId =
    new URL(req.url).searchParams.get('userId')?.trim() || 'demo-user'
  const projects = await getProjects(userId)
  return NextResponse.json(projects)
}

export async function POST(req: Request) {
  const body = await req.json()
  const userId =
    typeof body.userId === 'string' && body.userId.length > 0
      ? body.userId
      : 'demo-user'
  const project = await createProject(userId, body.name)
  return NextResponse.json(project)
}
