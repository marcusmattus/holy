export interface RuntimeMetric {
  name: string
  value: number
  tags?: Record<string, string>
}

export function emitRuntimeMetric(metric: RuntimeMetric): RuntimeMetric {
  return metric
}

export function emitRuntimeLog(message: string, context: Record<string, unknown> = {}) {
  return { message, context, timestamp: new Date().toISOString() }
}
