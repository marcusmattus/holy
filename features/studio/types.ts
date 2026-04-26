export type HolyFileMap = Record<string, string>

export type AiPatchRequest = {
  instruction: string
  files: HolyFileMap
  activeFile?: string
}

export type AiPatchResponse = {
  summary: string
  files: HolyFileMap
}

export type ProjectFiles = HolyFileMap
