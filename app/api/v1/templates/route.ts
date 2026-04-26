import { NextResponse } from 'next/server'
import { authenticateApiKey } from '@/server/security/api-key-auth'
import { prisma } from '@/server/db'

export async function GET(req: Request) {
  const auth = await authenticateApiKey(req, ['templates:read'])
  if (!auth) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const templates = await prisma.template.findMany({
    where: { isHidden: false },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ templates })
}

export async function POST(req: Request) {
  const auth = await authenticateApiKey(req, ['templates:write'])
  if (!auth) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = (await req.json()) as {
    name?: string
    description?: string
    files?: Record<string, string>
  }

  if (!body.name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }

  const template = await prisma.template.create({
    data: {
      name: body.name,
      description: body.description,
      files: body.files ?? {},
    },
  })

  return NextResponse.json({ template }, { status: 201 })
}
