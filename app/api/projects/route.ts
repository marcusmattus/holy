import { NextResponse } from 'next/server'
import { createProject, getProjects } from '@/server/services/project.service'

const DEMO_USER_ID = 'demo-user'

export async function GET() {
  const projects = await getProjects(DEMO_USER_ID)
  return NextResponse.json(projects)
}

export async function POST(req: Request) {
  const body = await req.json()
  const project = await createProject(DEMO_USER_ID, body.name)
  return NextResponse.json(project)
}
