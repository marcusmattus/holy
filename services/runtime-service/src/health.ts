import { getPrometheusMetrics } from './telemetry'

export function healthResponse() {
  return { status: 'ok', timestamp: new Date().toISOString() }
}

export function readinessResponse() {
  return { status: 'ready', dependencies: ['queue', 'executor'] }
}

export function metricsResponse() {
  return getPrometheusMetrics()
}
