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

export const AI_MODELS = [
  { id: 'gpt-4o', label: 'GPT-4o', provider: 'openai' },
  { id: 'gpt-4-turbo', label: 'GPT-4 Turbo', provider: 'openai' },
  { id: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', provider: 'openai' },
  { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet', provider: 'anthropic' },
  { id: 'claude-3-opus-20240229', label: 'Claude 3 Opus', provider: 'anthropic' },
  { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', provider: 'google' },
  { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', provider: 'google' },
] as const

export type AIModelId = (typeof AI_MODELS)[number]['id']

export const selectedModelAtom = atom<AIModelId>('gpt-4o')
