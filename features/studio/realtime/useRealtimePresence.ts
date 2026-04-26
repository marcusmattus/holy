"use client"

import { create } from 'zustand'

export type CollaboratorPresence = {
  userId: string
  name: string
  color: string
  cursorLine: number
  cursorColumn: number
}

type PresenceStore = {
  collaborators: CollaboratorPresence[]
  setCollaborators: (collaborators: CollaboratorPresence[]) => void
}

export const useRealtimePresence = create<PresenceStore>((set) => ({
  collaborators: [],
  setCollaborators: (collaborators) => set({ collaborators }),
}))
