import { generateAppFromPrompt } from '@/server/services/studio-generator.service'

export async function POST(req: Request) {
  const body = await req.json()
  const prompt = typeof body.prompt === 'string' ? body.prompt : ''

  if (!prompt) {
    return Response.json({ error: 'Prompt required' }, { status: 400 })
  }

  const manifest = await generateAppFromPrompt(prompt)

  return Response.json({ manifest })
}
