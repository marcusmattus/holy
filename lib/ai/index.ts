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
  assertAtLeastOneLLMProvider()
  const { text } = await generateText({
    model: resolveModel(provider),
    prompt,
  })
  return text
}

function safeParseJSON<T>(value: string): T | null {
  try {
    const cleaned = value.replace(/^```[^\n]*\n?/, '').replace(/```\s*$/, '').trim()
    return JSON.parse(cleaned) as T
  } catch {
    return null
  }
}

const MAX_PROMPT_CHARS = 4000

function normalizeForPrompt(value: string, maxChars = MAX_PROMPT_CHARS) {
  return value.replace(/[^\x09\x0A\x0D\x20-\x7E]/g, ' ').slice(0, maxChars)
}

function safeJSONStringify(value: unknown, maxChars = MAX_PROMPT_CHARS) {
  return normalizeForPrompt(JSON.stringify(value), maxChars)
}

export async function ideaToPRD(idea: string) {
  const safeIdea = normalizeForPrompt(idea)
  try {
    const text = await callLLM(
      `Convert this app idea into a concise JSON PRD with sections: summary, audience, keyFeatures, monetization.\nIdea: ${safeIdea}`,
    )
    const parsed = safeParseJSON<Record<string, unknown>>(text)
    if (parsed && typeof parsed.summary === 'string') {
      return parsed
    }
  } catch (error) {
    logger.warn('ideaToPRD failed, using fallback', { error: String(error) })
  }

  return { summary: idea, audience: 'general', keyFeatures: [], monetization: 'free' }
}

export async function prdToComponentSpec(prd: Record<string, unknown>) {
  const safePRD = safeJSONStringify(prd)
  try {
    const text = await callLLM(
      `Given this PRD JSON, return a JSON array of UI components and routes with shape [{name, purpose, route}]. PRD: ${safePRD}`,
    )
    const parsed = safeParseJSON<Array<{ name: string; purpose: string; route: string }>>(text)
    if (
      parsed &&
      parsed.every(
        (item) =>
          typeof item?.name === 'string' &&
          typeof item?.purpose === 'string' &&
          typeof item?.route === 'string',
      )
    ) {
      return parsed
    }
  } catch (error) {
    logger.warn('prdToComponentSpec failed, using fallback', { error: String(error) })
  }

  return [{ name: 'App', purpose: 'Main application page', route: '/' }]
}

export async function componentSpecToCode(spec: Array<{ name: string; purpose: string; route: string }>) {
  const safeSpec = safeJSONStringify(spec)
  try {
    const text = await callLLM(
      `Return a JSON object map of files for a React TypeScript app based on this component spec: ${safeSpec}.
Format exactly as raw JSON like {"/App.tsx":"...","/components/X.tsx":"..."}.`,
    )
    const parsed = safeParseJSON<Record<string, string>>(text)
    if (parsed && Object.values(parsed).every((value) => typeof value === 'string')) {
      return parsed
    }
  } catch (error) {
    logger.warn('componentSpecToCode failed, using fallback', { error: String(error) })
  }

  return {
    '/App.tsx':
      'export default function App() { return <main className="p-6">Your Holy app is ready.</main> }',
  }
}
