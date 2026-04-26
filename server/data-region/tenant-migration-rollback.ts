export function createRollbackPlan(fromRegion: string, toRegion: string) {
  return {
    strategy: 'snapshot-and-repoint',
    fromRegion,
    toRegion,
    steps: ['restore snapshot', 'rebind regional routing', 'validate settlement/payment links'],
  }
}
