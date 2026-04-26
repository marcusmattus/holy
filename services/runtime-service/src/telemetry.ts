export interface RuntimeMetric {
  name: string
  value: number
  labels?: Record<string, string>
}

const metricStore: RuntimeMetric[] = []

export function emitMetric(metric: RuntimeMetric) {
  metricStore.push(metric)
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
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(payload))
}
