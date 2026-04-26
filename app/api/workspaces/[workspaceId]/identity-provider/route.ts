import { NextResponse } from 'next/server'
import { prisma } from '@/server/services/prisma'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  const { workspaceId } = await params
  const config = await prisma.identityProviderConfig.findUnique({
    where: { workspaceId },
  })
  return NextResponse.json(config)
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  try {
    const { workspaceId } = await params
    const body = await req.json()
    const config = await prisma.identityProviderConfig.upsert({
      where: { workspaceId },
      update: {
        provider: body.provider,
        status: body.status,
        domains: body.domains ?? [],
        config: body.config,
      },
      create: {
        workspaceId,
        provider: body.provider,
        status: body.status,
        domains: body.domains ?? [],
        config: body.config,
      },
    })
    return NextResponse.json(config)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to save identity provider' },
      { status: 400 },
    )
  }
}
