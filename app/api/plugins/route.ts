import { listPlugins } from '@/server/services/plugin.service'

export async function GET() {
  return Response.json({ plugins: listPlugins() })
}
