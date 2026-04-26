import { PriceType, TemplateStatus } from '@prisma/client'
import { prisma } from '@/server/db/client'
import { getProjectFileMap, upsertProjectFiles } from './project-file.service'
import { ensureTemplatePublishPermission } from './collaboration.service'
import { trackUsageEvent } from './usage-meter.service'

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function sanitizeFileMap(files: Record<string, string>) {
  const sanitized: Record<string, string> = {}

  for (const [rawPath, rawContent] of Object.entries(files)) {
    const path = rawPath.trim().replace(/\\/g, '/').replace(/\.\./g, '')
    if (!path.startsWith('/')) {
      continue
    }

    const content = rawContent.replace(/process\.env\.[A-Z0-9_]+/g, '"[REDACTED_ENV]"')
    sanitized[path] = content
  }

  return sanitized
}

async function uniqueTemplateSlug(baseTitle: string) {
  const base = slugify(baseTitle) || 'template'
  let suffix = 0

  while (suffix < 1000) {
    const candidate = suffix === 0 ? base : `${base}-${suffix}`
    const exists = await prisma.template.findUnique({
      where: { slug: candidate },
      select: { id: true },
    })

    if (!exists) {
      return candidate
    }

    suffix += 1
  }

  return `${base}-${Date.now()}`
}

export async function createTemplateFromProject(input: {
  projectId: string
  creatorId: string
  title: string
  description: string
  category?: string
  priceType?: PriceType
  priceCents?: number
}) {
  await ensureTemplatePublishPermission(input.projectId, input.creatorId)

  const files = sanitizeFileMap(await getProjectFileMap(input.projectId))
  const slug = await uniqueTemplateSlug(input.title)

  return prisma.template.create({
    data: {
      sourceProjectId: input.projectId,
      creatorId: input.creatorId,
      title: input.title,
      slug,
      description: input.description,
      category: input.category,
      filesJson: files,
      priceType: input.priceType ?? PriceType.FREE,
      priceCents: input.priceCents ?? 0,
      status: TemplateStatus.PUBLISHED,
    },
  })
}

export async function updateTemplateStatus(
  templateId: string,
  creatorId: string,
  status: TemplateStatus,
) {
  return prisma.template.update({
    where: { id: templateId, creatorId },
    data: { status },
  })
}

export async function listPublishedTemplates() {
  return prisma.template.findMany({
    where: { status: TemplateStatus.PUBLISHED },
    include: {
      creator: { select: { id: true, email: true } },
      forks: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getTemplateBySlug(slug: string) {
  return prisma.template.findUnique({
    where: { slug },
    include: {
      creator: { select: { id: true, email: true } },
      forks: true,
    },
  })
}

export async function forkTemplate(input: {
  templateId: string
  userId: string
  projectName?: string
}) {
  const template = await prisma.template.findUniqueOrThrow({ where: { id: input.templateId } })

  const project = await prisma.project.create({
    data: {
      name: input.projectName ?? `${template.title} Remix`,
      userId: input.userId,
      description: `Forked from template: ${template.title}`,
      status: 'DRAFT',
    },
  })

  await upsertProjectFiles(project.id, sanitizeFileMap(template.filesJson as Record<string, string>))

  await prisma.templateFork.create({
    data: {
      templateId: template.id,
      userId: input.userId,
      projectId: project.id,
    },
  })

  await trackUsageEvent({
    userId: input.userId,
    type: 'TEMPLATE_FORK',
    metadata: { templateId: template.id, projectId: project.id },
  })

  return project
}
