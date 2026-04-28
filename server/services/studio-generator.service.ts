import { GeneratedAppManifest } from '@/features/holy-studio/types'

export async function generateAppFromPrompt(prompt: string): Promise<GeneratedAppManifest> {
  // TODO: replace with AI SDK (OpenAI / Anthropic)

  return {
    name: 'Generated App',
    slug: 'generated-app',
    description: prompt,
    stack: ['nextjs', 'tailwind'],
    files: [
      {
        path: 'app/page.tsx',
        language: 'tsx',
        content: `export default function Page() { return <div className="p-6">${prompt}</div> }`
      }
    ]
  }
}
