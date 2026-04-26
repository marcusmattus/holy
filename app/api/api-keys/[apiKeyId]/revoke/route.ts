import { ApiKeyStatus } from '@prisma/client'
import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { writeAuditLog } from '@/server/security/audit-log'

function getUserId(req: Request) {
  return req.headers.get('x-user-id') ?? 'demo-user'
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ apiKeyId: string }> },
) {
  const userId = getUserId(req)
  const { apiKeyId } = await params

  const apiKey = await prisma.apiKey.findUnique({ where: { id: apiKeyId } })
  if (!apiKey || apiKey.userId !== userId) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  const revoked = await prisma.apiKey.update({
    where: { id: apiKeyId },
    data: { status: ApiKeyStatus.REVOKED },
  })

  await writeAuditLog({
    actorId: userId,
    action: 'api_key.revoked',
    targetType: 'ApiKey',
    targetId: apiKeyId,
    workspaceId: apiKey.workspaceId ?? undefined,
  })

  return NextResponse.json({ apiKey: revoked })
}
