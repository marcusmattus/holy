import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { createOpenAI, openai } from '@ai-sdk/openai'
import { assertAtLeastOneLLMProvider, getEnv } from '@/lib/env'
import { logger } from '@/lib/logger'

export type AIProvider = 'openai' | 'anthropic'

const githubModels = createOpenAI({
  baseURL: 'https://models.inference.ai.azure.com',
  apiKey: process.env.GITHUB_TOKEN ?? '',
})

function resolveModel(provider: AIProvider = 'openai') {
  const env = getEnv()

  if (provider === 'anthropic') {
    if (env.ANTHROPIC_API_KEY) {
      return anthropic('claude-3-5-sonnet-latest')
    }
    return githubModels('claude-3.5-sonnet')
  }

  if (env.OPENAI_API_KEY) {
    return openai('gpt-4o')
  }

  return githubModels('gpt-4o')
}

export async function callLLM(prompt: string, provider: AIProvider = 'openai') {
  try {
    assertAtLeastOneLLMProvider()
    const { text } = await generateText({
      model: resolveModel(provider),
      prompt,
    })
    return text
  } catch (error) {
    logger.warn('LLM call failed, returning empty result', { provider, error: String(error) })
    return ''
  }
}

function safeParseJSON<T>(value: string): T | null {
  try {
    const cleaned = value.replace(/^```[^\n]*\n?/, '').replace(/```\s*$/, '').trim()
    return JSON.parse(cleaned) as T
  } catch {
    return null
  }
}

export async function ideaToPRD(idea: string) {
  const text = await callLLM(
    `Convert this app idea into a concise JSON PRD with sections: summary, audience, keyFeatures, monetization.\nIdea: ${idea}`,
  )
  const parsed = safeParseJSON<Record<string, unknown>>(text)
  return parsed ?? { summary: idea, audience: 'general', keyFeatures: [], monetization: 'free' }
}

export async function prdToComponentSpec(prd: Record<string, unknown>) {
  const text = await callLLM(
    `Given this PRD JSON, return a JSON array of UI components and routes with shape [{name, purpose, route}]. PRD: ${JSON.stringify(prd)}`,
  )
  const parsed = safeParseJSON<Array<{ name: string; purpose: string; route: string }>>(text)
  return parsed ?? [{ name: 'App', purpose: 'Main application page', route: '/' }]
}

export async function componentSpecToCode(spec: Array<{ name: string; purpose: string; route: string }>) {
  const text = await callLLM(
    `Return a JSON object map of files for a React TypeScript app based on this component spec: ${JSON.stringify(spec)}.
Format exactly as raw JSON like {"/App.tsx":"...","/components/X.tsx":"..."}.`,
  )
  const parsed = safeParseJSON<Record<string, string>>(text)
  return (
    parsed ?? {
      '/App.tsx':
        'export default function App() { return <main className="p-6">Your Holy app is ready.</main> }',
    }
  )
}
