export type RealtimeEvent = {
  channel: string
  event: string
  payload: Record<string, unknown>
}

export interface RealtimeProvider {
  publish(event: RealtimeEvent): Promise<void>
}

class NoopRealtimeProvider implements RealtimeProvider {
  async publish(): Promise<void> {
    // no-op for MVP
  }
}

export const realtimeProvider: RealtimeProvider = new NoopRealtimeProvider()
