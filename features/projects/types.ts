import type { GeneratedAppManifest } from '@/features/holy-studio/types'

export type HolyProjectStatus = 'draft' | 'generated' | 'editing' | 'published' | 'archived'

export type HolyProject = {
  id: string
  name: string
  slug: string
  prompt: string
  description: string
  status: HolyProjectStatus
  manifest: GeneratedAppManifest
  createdAt: string
  updatedAt: string
}

export type UpdateProjectInput = {
  name?: string
  description?: string
  status?: HolyProjectStatus
  manifest?: GeneratedAppManifest
}
