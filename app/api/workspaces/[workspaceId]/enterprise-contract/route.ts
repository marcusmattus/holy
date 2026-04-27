import { getEnterpriseContract } from '@/server/services/enterprise-contract.service'

export async function GET(_req: Request, context: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await context.params
  return Response.json({ contract: getEnterpriseContract(workspaceId) })
}
