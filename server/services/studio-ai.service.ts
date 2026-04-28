import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { GeneratedAppManifest } from '@/features/holy-studio/types'

export async function generateWithAI(prompt: string): Promise<GeneratedAppManifest> {
  try {
    const result = await generateText({
      model: openai('gpt-4.1'),
      prompt: `Generate a minimal Next.js app as JSON with files array. Idea: ${prompt}`
    })

    return JSON.parse(result.text)
  } catch (err) {
    return {
      name: 'Fallback App',
      slug: 'fallback-app',
      description: prompt,
      stack: ['nextjs'],
      files: [
        {
          path: 'app/page.tsx',
          language: 'tsx',
          content: `export default function Page(){return <div>${prompt}</div>}`
        }
      ]
    }
  }
}
