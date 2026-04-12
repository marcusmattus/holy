export async function getEarnings() {
  return { total: 0, pending: 0, paid: 0, currency: 'USDC' }
}

export async function claimRewards() {
  throw new Error('HolyOS rewards: not yet implemented')
}
