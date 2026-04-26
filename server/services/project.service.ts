import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
