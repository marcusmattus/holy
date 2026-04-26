import { getWorkspaceSamlMetadata } from '@/server/services/saml-auth.service'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ workspaceSlug: string }> }
) {
  const { workspaceSlug } = await params
  return new Response(getWorkspaceSamlMetadata(workspaceSlug), {
    headers: { 'Content-Type': 'application/xml' },
  })
}
