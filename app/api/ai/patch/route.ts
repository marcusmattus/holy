import { NextResponse } from 'next/server'
import { generateText } from '@/lib/ai'
import { extractJsonObject, toHolyFileMap } from '@/features/studio/lib/file-utils'
import type { AiPatchRequest, AiPatchResponse } from '@/features/studio/types'

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

    const parsed = extractJsonObject(raw)
    const files = toHolyFileMap(parsed.files)
    const summary = typeof parsed.summary === 'string' ? parsed.summary : 'Patch applied'

    if (Object.keys(files).length === 0) {
      throw new Error('AI patch response did not include valid files')
    }

    const payload: AiPatchResponse = { summary, files }
    return NextResponse.json(payload)
  } catch (error) {
    console.error('[AI_PATCH_ERROR]', error)
    return NextResponse.json({ error: 'Failed to patch files' }, { status: 500 })
  }
}
