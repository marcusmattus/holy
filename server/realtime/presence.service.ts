import { realtimeProvider } from './realtime-provider'

export async function broadcastProjectPresence(projectId: string) {
  await realtimeProvider.publish({
    channel: `project:${projectId}`,
    event: 'presence.updated',
    payload: { projectId },
  })
}
