import { NextResponse } from 'next/server'
import { runWorkflow } from '@/server/services/workflow.service'
import { enforceApiKeyAndRateLimit } from '@/server/services/api-rate-limit.service'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ workflowId: string }> },
) {
  try {
    const apiKey = req.headers.get('x-api-key')
    if (!apiKey) {
      return NextResponse.json({ error: 'x-api-key header is required' }, { status: 401 })
    }

    await enforceApiKeyAndRateLimit({
      apiKey,
      requiredScope: 'workflows:run',
    })

    const { workflowId } = await params
    const body = await req.json()
    const run = await runWorkflow(workflowId, {
      input: body.input,
      lowRiskAutoApplyEnabled: body.lowRiskAutoApplyEnabled === true,
    })
    return NextResponse.json(run, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to run workflow'
    const status = message === 'Rate limit exceeded' ? 429 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
