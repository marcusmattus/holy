import { NextResponse } from 'next/server'
import { generateText } from '@/lib/ai'
import type { AiPatchRequest, AiPatchResponse } from '@/features/studio/types'

function extractJson(text: string) {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON object returned')
  return JSON.parse(text.slice(start, end + 1))
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AiPatchRequest

    const raw = await generateText(`
You are Holy AI, an expert React + Tailwind engineer.

Patch this Sandpack React TypeScript app.

Rules:
- Return ONLY valid JSON.
- Keep every existing file unless changing it.
- Preserve the Ethereal IDE visual system where relevant:
  - dark #0A0A0A background
  - gold #C9A24A primary actions
  - glass panels
  - Space Grotesk typography
- Do not include markdown fences.

User instruction:
${body.instruction}

Active file:
${body.activeFile ?? 'none'}

Current files JSON:
${JSON.stringify(body.files, null, 2)}

Return shape:
{
  "summary": "brief explanation",
  "files": {
    "/App.tsx": "full updated file content"
  }
}
`)

    const parsed = extractJson(raw) as AiPatchResponse

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('[AI_PATCH_ERROR]', error)
    return NextResponse.json({ error: 'Failed to patch files' }, { status: 500 })
  }
}
