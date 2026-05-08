/**
 * Holy Studio — server-side service layer
 * Handles project creation from AI-generated code, version management.
 */

import { prisma } from '@/lib/db'

// Local alias until `prisma generate` runs with the updated schema
type Project = Awaited<ReturnType<typeof prisma.project.create>>

export type CreateFromPromptInput = {
  userId: string
  name: string
  description?: string
  category?: string
  generatedCode: string
}

/**
 * Create a new project from a Studio-generated component, saving the
 * first version snapshot automatically.
 */
export async function createProjectFromStudio(
  input: CreateFromPromptInput,
): Promise<Project> {
  const slug =
    input.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') +
    '-' +
    Date.now()

  const project = await prisma.project.create({
    data: {
      name: input.name,
      slug,
      description: input.description,
      category: input.category,
      userId: input.userId,
      holyosProjectId: `studio_${slug}`,
    },
  })

  await prisma.projectVersion.create({
    data: {
      projectId: project.id,
      snapshot: input.generatedCode,
      label: 'v1 — AI generated',
    },
  })

  return project
}

/**
 * Save an editor snapshot as a new version.
 */
export async function saveVersion(
  projectId: string,
  snapshot: string,
  label?: string,
) {
  const [version] = await Promise.all([
    prisma.projectVersion.create({
      data: { projectId, snapshot, label },
    }),
    prisma.project.update({
      where: { id: projectId },
      data: { updatedAt: new Date() },
    }),
  ])
  return version
}

/**
 * Return the latest version snapshot for a project, or null.
 */
export async function getLatestSnapshot(projectId: string): Promise<string | null> {
  const version = await prisma.projectVersion.findFirst({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
  })
  return version?.snapshot ?? null
}
