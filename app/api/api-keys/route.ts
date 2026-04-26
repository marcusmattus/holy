import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { generateApiKey } from '@/server/security/api-key-auth'
import { writeAuditLog } from '@/server/security/audit-log'

function getUserId(req: Request) {
  return req.headers.get('x-user-id') ?? 'demo-user'
}

export async function GET(req: Request) {
  const userId = getUserId(req)
  const apiKeys = await prisma.apiKey.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      prefix: true,
      scopes: true,
      status: true,
      lastUsedAt: true,
      expiresAt: true,
      createdAt: true,
    },
  })
  return NextResponse.json({ apiKeys })
}

export async function POST(req: Request) {
  const userId = getUserId(req)
  const body = (await req.json()) as {
    name?: string
    workspaceId?: string
    scopes?: string[]
    expiresAt?: string
  }

  if (!body.name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }

  const key = generateApiKey()
  const created = await prisma.apiKey.create({
    data: {
      name: body.name,
      userId,
      workspaceId: body.workspaceId,
      scopes: body.scopes ?? [],
      keyHash: key.keyHash,
      prefix: key.prefix,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    },
  })

  await writeAuditLog({
    actorId: userId,
    action: 'api_key.created',
    targetType: 'ApiKey',
    targetId: created.id,
    workspaceId: body.workspaceId,
    metadata: { scopes: body.scopes ?? [] },
  })

  return NextResponse.json(
    {
      apiKey: {
        id: created.id,
        name: created.name,
        prefix: created.prefix,
        scopes: created.scopes,
      },
      plaintextKey: key.raw,
      note: 'This is only shown once. Store it securely.',
    },
    { status: 201 },
  )
}
