const counters = new Map<string, number>()

export function incrementMetric(name: string, value = 1) {
  counters.set(name, (counters.get(name) ?? 0) + value)
}

export function setMetric(name: string, value: number) {
  counters.set(name, value)
}

export function getMetrics() {
  return Object.fromEntries(counters.entries())
}
