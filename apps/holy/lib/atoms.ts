import { atom } from 'jotai'

export interface UserAtom {
  id: string
  name: string
  email: string
  plan: 'free' | 'pro' | 'teams'
  walletAddress?: string
}

export const userAtom = atom<UserAtom | null>(null)

export const sidebarOpenAtom = atom<boolean>(true)

export interface ProjectAtom {
  id: string
  name: string
  status: 'active' | 'draft' | 'archived'
}

export const activeProjectAtom = atom<ProjectAtom | null>(null)

export const editorCodeAtom = atom<string>('')

export const aiChatOpenAtom = atom<boolean>(false)

export const themeAtom = atom<'light' | 'dark'>('dark')
