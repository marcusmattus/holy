import { prisma } from '@/server/db/prisma'

export async function createProject(userId: string, name: string) {
  return prisma.project.create({
    data: {
      userId,
      name
    }
  })
}

export async function getProjects(userId: string) {
  return prisma.project.findMany({
    where: { userId }
  })
}
