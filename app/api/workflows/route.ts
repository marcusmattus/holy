import { NextResponse } from 'next/server'
import { createWorkflow } from '@/server/services/workflow.service'
import { enforceApiKeyAndRateLimit } from '@/server/services/api-rate-limit.service'

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get('x-api-key')
    if (apiKey) {
      await enforceApiKeyAndRateLimit({
        apiKey,
        requiredScope: 'workflows:write',
      })
    }

    const body = await req.json()
    const workflow = await createWorkflow({
      ownerId: body.ownerId ?? 'demo-user',
      workspaceId: body.workspaceId,
      name: body.name,
      description: body.description,
      definition: body.definition,
    })
    return NextResponse.json(workflow, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create workflow'
    const status = message === 'Rate limit exceeded' ? 429 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
