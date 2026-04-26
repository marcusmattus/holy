export function enforcePrivacyBudget(current: number, requested: number, limit = 1) {
  if (current + requested > limit) {
    throw new Error('Privacy budget exceeded')
  }
  return current + requested
}
