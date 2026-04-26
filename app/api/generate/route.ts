import { generateText } from 'ai'
import { openai, createOpenAI } from '@ai-sdk/openai'

const githubModels = createOpenAI({
  baseURL: 'https://models.inference.ai.azure.com',
  apiKey: process.env.GITHUB_TOKEN ?? '',
})

function getDefaultModel() {
  if (process.env.OPENAI_API_KEY) {
    return openai('gpt-4o')
  }
  return githubModels('gpt-4o')
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

function createFallbackFiles(prompt: string) {
  return {
    '/App.tsx': `export default function App() {\n  return (\n    <main className="p-10">\n      <section data-holy-id="hero">${prompt}</section>\n      <section data-holy-id="pricing">Pricing section</section>\n    </main>\n  )\n}`,
  }
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

  const cleaned = text.replace(/^```[^\n]*\n?/, '').replace(/```\s*$/, '').trim()

  if (cleaned.length > 0) {
    try {
      const parsed = JSON.parse(cleaned)
      if (
        parsed &&
        typeof parsed === 'object' &&
        !Array.isArray(parsed) &&
        Object.values(parsed).every((value) => typeof value === 'string')
      ) {
        return Response.json({ files: parsed as Record<string, string> })
      }
    } catch {
      // Fall through to code response.
    }

    return Response.json({ code: cleaned })
  }

  return Response.json({
    code: createFallbackCode(prompt),
    files: createFallbackFiles(prompt),
  })
}
