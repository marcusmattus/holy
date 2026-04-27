import { getAutonomyPolicy, updateAutonomyPolicy } from '@/server/services/autonomy-policy.service'

export async function GET(_req: Request, context: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await context.params
  return Response.json({ policy: getAutonomyPolicy(workspaceId) })
}

export async function POST(req: Request, context: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await context.params
  const body = await req.json()
  return Response.json({ policy: updateAutonomyPolicy(workspaceId, body) })
}
