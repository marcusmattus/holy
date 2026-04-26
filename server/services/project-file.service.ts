import { prisma } from '@/server/db/client'

export async function getProjectFileMap(projectId: string): Promise<Record<string, string>> {
  const latestVersion = await prisma.projectVersion
    .findFirst({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    })
    .catch(() => null)

  if (!latestVersion?.code) {
    return {
      '/App.tsx': 'export default function App() { return <div>Holy app</div> }',
    }
  }

  try {
    const parsed = JSON.parse(latestVersion.code) as Record<string, string>
    if (parsed && typeof parsed === 'object') {
      return parsed
    }
  } catch {
    // fall through
  }

  return {
    '/App.tsx': latestVersion.code,
  }
}
