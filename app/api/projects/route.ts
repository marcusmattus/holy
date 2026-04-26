import { NextResponse } from 'next/server'
import { createProject, getProjects } from '@/server/services/project.service'

export async function GET() {
  const userId = 'demo-user'
  const projects = await getProjects(userId)
  return NextResponse.json(projects)
}

export async function POST(req: Request) {
  const body = await req.json()
  const project = await createProject('demo-user', body.name)
  return NextResponse.json(project)
}
