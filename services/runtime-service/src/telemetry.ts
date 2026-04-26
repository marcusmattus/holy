export interface RuntimeMetric {
  name: string
  value: number
  labels?: Record<string, string>
}

const metricStore: RuntimeMetric[] = []
const MAX_METRICS = Number(process.env.RUNTIME_MAX_IN_MEMORY_METRICS ?? 10_000)

export function emitMetric(metric: RuntimeMetric) {
  metricStore.push(metric)
  if (metricStore.length > MAX_METRICS) {
    metricStore.splice(0, metricStore.length - MAX_METRICS)
  }
}

export function getPrometheusMetrics() {
  return metricStore
    .map((metric) => {
      const labels = metric.labels
        ? `{${Object.entries(metric.labels)
            .map(([k, v]) => `${k}="${v}"`)
            .join(',')}}`
        : ''
      return `${metric.name}${labels} ${metric.value}`
    })
    .join('\n')
}

export function structuredLog(event: string, fields: Record<string, unknown>) {
  const payload = {
    ts: new Date().toISOString(),
    event,
    ...fields,
  }
  console.log(JSON.stringify(payload))
}
