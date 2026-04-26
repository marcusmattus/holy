import { NextResponse } from 'next/server'
import type { IncidentSeverity, IncidentSource } from '@prisma/client'
import { createIncident, listIncidents } from '@/server/services/incident.service'
import { assertAdmin } from '@/server/security'

export async function GET(request: Request) {
  try {
    assertAdmin(request)
    const incidents = await listIncidents()
    return NextResponse.json({ incidents })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unauthorized' }, { status: 403 })
  }
}

export async function POST(request: Request) {
  try {
    assertAdmin(request)
    const body = (await request.json()) as {
      title: string
      description?: string
      severity: IncidentSeverity
      source: IncidentSource
    }

    const incident = await createIncident(body)
    return NextResponse.json({ incident })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create incident' }, { status: 400 })
  }
}
