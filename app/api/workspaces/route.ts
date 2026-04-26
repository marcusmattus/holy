import { NextResponse } from 'next/server'
import { prisma } from '@/server/db/client'

const DEMO_USER_ID = 'demo-user'

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function GET() {
  const workspaces = await prisma.workspace.findMany({
    where: {
      OR: [{ ownerId: DEMO_USER_ID }, { members: { some: { userId: DEMO_USER_ID } } }],
    },
    include: { members: true },
  })
  return NextResponse.json({ workspaces })
}

export async function POST(req: Request) {
  const body = await req.json()
  const name = String(body.name || '').trim()
  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }

  const workspace = await prisma.workspace.create({
    data: {
      name,
      slug: slugify(name),
      ownerId: DEMO_USER_ID,
      members: {
        create: { userId: DEMO_USER_ID, role: 'OWNER' },
      },
    },
  })

  return NextResponse.json({ workspace }, { status: 201 })
}
