import { StoreEntry, Review, Project } from '@prisma/client'

export type { StoreEntry, Review }

export type StoreEntryWithProject = StoreEntry & {
  project: Project
}

export type StoreEntryFull = StoreEntry & {
  project: Project
  reviews: (Review & {
    user: {
      id: string
      name: string | null
      avatarUrl: string | null
    }
  })[]
}

export type CreateStoreEntryInput = {
  projectId: string
  screenshots?: string[]
  longDescription?: string
  demoUrl?: string
}

export type UpdateStoreEntryInput = Partial<CreateStoreEntryInput> & {
  status?: 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'REJECTED'
}
