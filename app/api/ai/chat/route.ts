import { streamText } from 'ai'
import { createOpenAI, openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { trackEvent } from '@/server/services/analytics.service'

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

// GitHub Models — OpenAI-compatible endpoint, free with a GitHub PAT
const githubModels = createOpenAI({
  baseURL: 'https://models.inference.ai.azure.com',
  apiKey: process.env.GITHUB_TOKEN ?? '',
})

function getModel(modelId: string) {
  // Google Gemini — always uses the Google AI API key
  if (modelId.startsWith('gemini-')) {
    return google(modelId)
  }

  // OpenAI models: use direct key if available, fall back to GitHub Models
  if (modelId.startsWith('gpt-') || modelId.startsWith('o1') || modelId.startsWith('o3')) {
    if (process.env.OPENAI_API_KEY) {
      return openai(modelId)
    }
    return githubModels(modelId)
  }

  // Anthropic (Claude) models: use direct key if available, fall back to GitHub Models
  if (modelId.startsWith('claude-')) {
    if (process.env.ANTHROPIC_API_KEY) {
      return anthropic(modelId)
    }
    // GitHub Models uses the same model ID format for Claude
    return githubModels(modelId)
  }

  // Default fallback
  if (process.env.OPENAI_API_KEY) {
    return openai('gpt-4o')
  }
  return githubModels('gpt-4o')
}

export async function POST(req: Request) {
  const { messages, model = 'gpt-4o', projectId } = await req.json()

  if (typeof projectId === 'string') {
    await trackEvent({
      projectId,
      eventName: 'AI_PATCH_APPLIED',
      metadata: { source: 'ai-chat' },
    }).catch(() => null)
  }

  const result = streamText({
    model: getModel(model),
    system: SYSTEM_PROMPT,
    messages,
  })

  return result.toDataStreamResponse()
}
