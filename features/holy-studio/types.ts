export type GeneratedAppFile = {
  path: string
  content: string
  language: 'tsx' | 'ts' | 'css' | 'json' | 'md'
}

export type GeneratedAppManifest = {
  name: string
  slug: string
  description: string
  stack: string[]
  files: GeneratedAppFile[]
}

export type StudioProjectDraft = {
  id: string
  prompt: string
  manifest: GeneratedAppManifest
  createdAt: string
}
