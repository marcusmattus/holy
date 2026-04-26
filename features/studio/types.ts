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
