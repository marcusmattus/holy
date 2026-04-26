import { logger } from '@/lib/logger'
import { rateLimit } from '@/lib/rate-limit'
import { enqueueGenerateJob } from '@/server/queues/generate.queue'
import { generateProjectFiles } from '@/server/services/generate.service'

function getRateLimitKey(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const realIp = req.headers.get('x-real-ip')?.trim()
  const connectIp = req.headers.get('cf-connecting-ip')?.trim()
  const candidateIp = connectIp || realIp || forwarded || 'anonymous'
  return `generate:${candidateIp}`
}

function createFallbackCode(prompt: string) {
  return `
const root = document.getElementById('root')
if (root) {
  const card = document.createElement('div')
  card.style.cssText = 'padding:24px;font-family:Inter,Arial,sans-serif'
  const title = document.createElement('h1')
  title.textContent = 'Holy Studio'
  const body = document.createElement('p')
  body.textContent = ${JSON.stringify(prompt || 'Start building...')}
  card.append(title, body)
  root.append(card)
}
`.trim()
}

export async function POST(req: Request) {
  const body = (await req.json()) as { prompt?: unknown }
  const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : ''

  if (!prompt) {
    return Response.json({ error: 'Prompt is required.' }, { status: 400 })
  }

  const { text } = await generateText({
    model: getDefaultModel(),
    prompt: `Return only JavaScript ES module code (no markdown fences) that runs in a browser and renders into an existing <div id="root"></div> using plain DOM APIs.
Do not import anything.
Make the output visible and styled with inline styles.

In /App.tsx include major sections with data-holy-id attributes, especially data-holy-id="hero" and data-holy-id="pricing".

Idea: ${prompt}`,
  })

  // Strip markdown code fences if the model included them
  const code = text.replace(/^```[^\n]*\n?/, '').replace(/```\s*$/, '').trim()
  const hasCode = code.length > 0

  if (hasCode) {
    return Response.json({ code })
  }

  return Response.json({ code: createFallbackCode(prompt) })
  const limit = rateLimit(getRateLimitKey(req))
  if (!limit.ok) {
    return Response.json(
      { error: 'Too many requests', retryAfterSeconds: limit.retryAfterSeconds },
      { status: 429 },
    )
  }

  try {
    const cleaned = text.replace(/^```[^\n]*\n?/, '').replace(/```\s*$/, '').trim()
    files = JSON.parse(cleaned)
  } catch (err) {
    console.error('Failed to parse AI-generated files JSON:', err)
    files = {
      '/App.tsx': `export default function App() {\n  return (\n    <main className="p-10">\n      <section data-holy-id="hero">${prompt}</section>\n      <section data-holy-id="pricing">Pricing section</section>\n    </main>\n  )\n}`,
    const { prompt, projectId } = await req.json()
    if (!prompt || typeof prompt !== 'string') {
      return Response.json({ error: 'prompt is required' }, { status: 400 })
    }

    const result = await enqueueGenerateJob(() =>
      generateProjectFiles({
        prompt,
        projectId: typeof projectId === 'string' ? projectId : undefined,
      }),
    )
    return Response.json(result)
  } catch (err) {
    logger.error('Generate route failed', { error: String(err) })
    return Response.json({ error: 'Failed to generate project files' }, { status: 500 })
  }
}
