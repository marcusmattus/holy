export type AlertLevel = 'info' | 'warning' | 'critical'

export function evaluateAlert(name: string, value: number) {
  const level: AlertLevel = value > 50 ? 'critical' : value > 10 ? 'warning' : 'info'
  return { name, value, level }
}
