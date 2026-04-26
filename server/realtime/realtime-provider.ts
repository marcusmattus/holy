export type RealtimeRoom = {
  roomKey: string
  projectId: string
  provider: 'yjs' | 'simulated'
}

export interface RealtimeProvider {
  createRoom(projectId: string): Promise<RealtimeRoom>
  getRoom(projectId: string): Promise<RealtimeRoom | null>
}
