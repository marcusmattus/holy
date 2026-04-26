export type HolyFileMap = {
  [path: string]: string
}

export type ProjectFiles = HolyFileMap

export type ComponentRegistryItem = {
  id: string
  name: string
  selector: string
  filePath: string
  exportName?: string
  description?: string
}
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
