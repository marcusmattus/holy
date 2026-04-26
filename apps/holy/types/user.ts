import { User } from '@prisma/client'

export type { User }

export type UserWithProjects = User & {
  projects: {
    id: string
    name: string
    slug: string
    published: boolean
    createdAt: Date
  }[]
}

export type UserProfile = Omit<User, 'holyosUserId'>

export type CreateUserInput = {
  email: string
  name?: string
  holyosUserId: string
}

export type UpdateUserInput = Partial<{
  name: string
  avatarUrl: string
  walletAddress: string
  plan: 'FREE' | 'PRO' | 'TEAMS'
}>
