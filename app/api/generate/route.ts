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

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const { text } = await generateText({
    model: getDefaultModel(),
    prompt: `Return a JSON object of files for a React TypeScript app.
Format exactly like this (no markdown fences, just raw JSON):
{
  "/App.tsx": "code here",
  "/components/Button.tsx": "code here"
}

In /App.tsx include major sections with data-holy-id attributes, especially data-holy-id="hero" and data-holy-id="pricing".

Idea: ${prompt}`,
  })

  let files: Record<string, string>
  try {
    const cleaned = text.replace(/^```[^\n]*\n?/, '').replace(/```\s*$/, '').trim()
    files = JSON.parse(cleaned)
  } catch (err) {
    console.error('Failed to parse AI-generated files JSON:', err)
    files = {
      '/App.tsx': `export default function App() {\n  return (\n    <main className="p-10">\n      <section data-holy-id="hero">${prompt}</section>\n      <section data-holy-id="pricing">Pricing section</section>\n    </main>\n  )\n}`,
    }
  }

  return Response.json({ files })
}
