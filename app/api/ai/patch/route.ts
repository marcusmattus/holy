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

function changedFiles(before: HolyFileMap, after: HolyFileMap) {
  return Object.keys(after).filter((path) => before[path] !== after[path])
}

export async function POST(req: Request) {
  const { instruction, activeFile, files, component } = await req.json()

  const targetFile = component?.filePath ?? activeFile
  const componentScope = component
    ? `Target component: ${component.name} at ${component.filePath}.`
    : targetFile
      ? `Active file: ${targetFile}.`
      : 'No active file provided.'

  const { text } = await generateText({
    model: getDefaultModel(),
    prompt: `You are editing a React TypeScript app file map.\n${componentScope}\nInstruction: ${instruction}\nOnly edit ${targetFile ?? 'the minimum required file'} unless a dependency file must also change.\nReturn strict JSON with this shape:\n{\n  "summary": "short summary",\n  "files": {"/App.tsx": "..."}\n}\nDo not use markdown fences.\nInput files:\n${JSON.stringify(files)}`,
  })

  const parsed = toJson<{ summary?: string; files?: HolyFileMap }>(text)
  const patchedFiles = parsed?.files ?? files

  return Response.json({
    summary: parsed?.summary ?? 'Patched files',
    changedFiles: changedFiles(files, patchedFiles),
    files: patchedFiles,
  })
}
