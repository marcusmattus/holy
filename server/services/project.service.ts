import { prisma } from '@/server/db/client'

export async function createProject(userId: string, name: string) {
  // Keep demo environments usable by ensuring the placeholder user exists.
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: `${userId}@holy.example`,
    },
  })

  return prisma.project.create({
    data: {
      userId,
      name,
    },
  })
}

export async function getProjects(userId: string) {
  return prisma.project.findMany({
    where: { userId },
  })
}
