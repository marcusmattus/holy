import { generateText } from 'ai'
import { openai, createOpenAI } from '@ai-sdk/openai'

type HolyFileMap = Record<string, string>

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

function stripCodeFences(value: string) {
  return value.replace(/^```[a-zA-Z]*\n?/, '').replace(/```\s*$/, '').trim()
}

function toJson<T>(value: string): T | null {
  try {
    return JSON.parse(stripCodeFences(value)) as T
  } catch {
    return null
  }
}

function getChangedFiles(before: HolyFileMap, after: HolyFileMap) {
  const paths = new Set([...Object.keys(before), ...Object.keys(after)])
  return Array.from(paths).filter((path) => {
    const existsBefore = Object.hasOwn(before, path)
    const existsAfter = Object.hasOwn(after, path)
    if (existsBefore !== existsAfter) return true
    return before[path] !== after[path]
  })
}

export async function POST(req: Request) {
  const { instruction, activeFile, files, component } = await req.json()

  const targetFile = component?.filePath ?? activeFile
  const componentScope = component
    ? `Target component: ${component.name} at ${component.filePath}.`
    : targetFile
      ? `Active file: ${targetFile}.`
      : 'No active file provided.'

  const prompt = `You are editing a React TypeScript app file map.
${componentScope}
Instruction: ${instruction}
Only edit ${targetFile ?? 'the minimum required file'} unless a dependency file must also change.
Return strict JSON with this shape:
{
  "summary": "short summary",
  "files": {"/App.tsx": "..."}
}
Do not use markdown fences.
Input files:
${JSON.stringify(files)}`

  const { text } = await generateText({
    model: getDefaultModel(),
    prompt,
  })

  const parsed = toJson<{ summary?: string; files?: HolyFileMap }>(text)
  const patchedFiles = parsed?.files ?? files

  return Response.json({
    summary: parsed?.summary ?? 'Patched files',
    changedFiles: getChangedFiles(files, patchedFiles),
    files: patchedFiles,
  })
}
