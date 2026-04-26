import { Project, ProjectVersion, StoreEntry } from '@prisma/client'

export type { Project, ProjectVersion }

export type ProjectWithVersions = Project & {
  versions: ProjectVersion[]
}

export type ProjectWithStore = Project & {
  storeEntry: StoreEntry | null
}

export type ProjectFull = Project & {
  versions: ProjectVersion[]
  storeEntry: StoreEntry | null
  user: {
    id: string
    name: string | null
    email: string
    avatarUrl: string | null
  }
}

export type CreateProjectInput = {
  name: string
  slug: string
  description?: string
  category?: string
  holyosProjectId: string
}

export type UpdateProjectInput = Partial<CreateProjectInput> & {
  thumbnail?: string
  published?: boolean
  storePrice?: number
  techStack?: string
  deployUrl?: string
}
