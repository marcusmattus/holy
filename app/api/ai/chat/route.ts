import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'

const SYSTEM_PROMPT = `You are Holy AI, an expert web developer assistant built into the Holy vibecoding platform. Your job is to help users build production-ready websites and web apps.

When asked to generate a component or page:
1. Return clean, working React/Next.js TSX code using Tailwind CSS for styling
2. Wrap ALL code in a single markdown code block with the tsx language tag: \`\`\`tsx ... \`\`\`
3. Use functional components with TypeScript types
4. Use Tailwind CSS classes for all styling — no inline styles
5. Make components responsive and accessible
6. Add 'use client' directive when using hooks or browser APIs
7. Keep imports minimal (React is auto-imported in Next.js, only import hooks you use)

When answering questions, be concise and practical. Always focus on website building best practices.`

function getModel(modelId: string) {
  if (modelId.startsWith('gpt-')) {
    return openai(modelId)
  }
  if (modelId.startsWith('claude-')) {
    return anthropic(modelId)
  }
  if (modelId.startsWith('gemini-')) {
    return google(modelId)
  }
  return openai('gpt-4o')
}

export async function POST(req: Request) {
  const { messages, model = 'gpt-4o' } = await req.json()

  const result = streamText({
    model: getModel(model),
    system: SYSTEM_PROMPT,
    messages,
  })

  return result.toDataStreamResponse()
}
