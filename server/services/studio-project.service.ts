import { StudioProjectDraft } from '@/features/holy-studio/types'

const projects = new Map<string, StudioProjectDraft>()

export function saveProject(project: StudioProjectDraft) {
  projects.set(project.id, project)
  return project
}

export function getProject(id: string) {
  return projects.get(id)
}

export function listProjects() {
  return Array.from(projects.values())
}
