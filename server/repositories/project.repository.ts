import { HolyProject } from '@/features/projects/types'

// In-memory fallback (replace with Prisma later)
const store = new Map<string, HolyProject>()

export function createProject(project: HolyProject) {
  store.set(project.id, project)
  return project
}

export function getProjectById(id: string) {
  return store.get(id) || null
}

export function listProjects() {
  return Array.from(store.values())
}

export function updateProject(id: string, updates: Partial<HolyProject>) {
  const existing = store.get(id)
  if (!existing) return null

  const updated = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  }

  store.set(id, updated)
  return updated
}
