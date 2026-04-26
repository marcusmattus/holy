import { prisma } from '@/server/db/prisma'
import type { RealtimeProvider, RealtimeRoom } from '@/server/realtime/realtime-provider'

export class YjsProvider implements RealtimeProvider {
  async createRoom(projectId: string): Promise<RealtimeRoom> {
    const existing = await prisma.collaborationRoom.findFirst({ where: { projectId } })
    if (existing) {
      return {
        roomKey: existing.roomKey,
        projectId: existing.projectId,
        provider: 'yjs',
      }
    }

    const room = await prisma.collaborationRoom.create({
      data: {
        projectId,
        roomKey: `project-${projectId}`,
        provider: 'yjs',
      },
    })

    return {
      roomKey: room.roomKey,
      projectId: room.projectId,
      provider: 'yjs',
    }
  }

  async getRoom(projectId: string): Promise<RealtimeRoom | null> {
    const room = await prisma.collaborationRoom.findFirst({ where: { projectId } })
    if (!room) return null
    return {
      roomKey: room.roomKey,
      projectId: room.projectId,
      provider: 'yjs',
    }
  }
}
