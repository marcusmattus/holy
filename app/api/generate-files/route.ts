import { NextResponse } from 'next/server'
import { generateText } from '@/lib/ai'
import { defaultHolyFiles } from '@/features/studio/lib/default-files'

function extractJson(text: string) {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON object returned')
  return JSON.parse(text.slice(start, end + 1))
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const raw = await generateText(`
Generate a Sandpack React TypeScript file map for this app idea.
Return ONLY valid JSON.
Use this shape:
{
  "summary": "brief summary",
  "files": {
    "/App.tsx": "full file content",
    "/src/styles.css": "full file content"
  }
}

Rules:
- Use React + TypeScript.
- Use Tailwind-like utility class names only where supported by the runtime CSS or write plain CSS in /src/styles.css.
- Preserve Holy Ethereal IDE aesthetic where relevant.
- Include /package.json, /index.html, /src/main.tsx, /src/styles.css.

Idea:
${prompt}
`)

    const parsed = extractJson(raw)

    return NextResponse.json({
      summary: parsed.summary ?? 'Generated app',
      files: {
        ...defaultHolyFiles,
        ...parsed.files,
      },
    })
  } catch (error) {
    console.error('[GENERATE_FILES_ERROR]', error)
    return NextResponse.json({ error: 'Failed to generate files' }, { status: 500 })
  }
}
