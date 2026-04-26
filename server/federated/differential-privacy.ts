export function addDifferentialPrivacyNoise(value: number, epsilon = 1) {
  const bounded = Number.isFinite(value) ? value : 0
  const jitter = (Math.random() - 0.5) * (1 / Math.max(epsilon, 0.1))
  return Number((bounded + jitter).toFixed(4))
}
