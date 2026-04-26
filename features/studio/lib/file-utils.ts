import type { HolyFileMap } from '../types'

export function mergeHolyFiles(baseFiles: HolyFileMap, nextFiles: HolyFileMap): HolyFileMap {
  return {
    ...baseFiles,
    ...nextFiles,
  }
}

export function extractJsonObject(text: string) {
  let start = -1
  let depth = 0
  let inString = false
  let escaped = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]

    if (char === '"' && !escaped) {
      inString = !inString
    }

    if (char === '\\' && inString) {
      escaped = !escaped
    } else {
      escaped = false
    }

    if (inString) continue

    if (char === '{') {
      if (depth === 0) start = i
      depth += 1
      continue
    }

    if (char === '}') {
      if (depth === 0) continue
      depth -= 1

      if (depth === 0 && start !== -1) {
        try {
          const parsed = JSON.parse(text.slice(start, i + 1))
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            return parsed as Record<string, unknown>
          }
        } catch {
          start = -1
        }
      }
    }
  }

  throw new Error('Invalid JSON format: unable to parse JSON object from model response')
}

export function toHolyFileMap(value: unknown): HolyFileMap {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  const entries = Object.entries(value).filter(([, content]) => typeof content === 'string')
  return Object.fromEntries(entries) as HolyFileMap
}
