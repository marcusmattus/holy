import { NextResponse } from 'next/server'
import { createExportDestination, createExportJob } from '@/server/services/export-job.service'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  const { workspaceId } = await params
  return NextResponse.json({ workspaceId, message: 'Use POST to create destinations and jobs' })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  const { workspaceId } = await params
  const body = await request.json()

  if (!body?.type || !body?.name || !body?.config) {
    return NextResponse.json(
      { error: 'type, name, and config are required' },
      { status: 400 },
    )
  }

  const destination = await createExportDestination({
    workspaceId,
    type: body.type,
    name: body.name,
    config: body.config,
  })

  if (body.payload) {
    const job = await createExportJob({
      destinationId: destination.id,
      payload: body.payload,
    })

    return NextResponse.json({ destination, job }, { status: 201 })
  }

  return NextResponse.json({ destination }, { status: 201 })
}
