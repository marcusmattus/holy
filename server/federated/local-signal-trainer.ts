export function trainLocalSignals(signals: number[]) {
  if (!signals.length) return { average: 0, count: 0 }
  const sum = signals.reduce((acc, value) => acc + value, 0)
  return { average: sum / signals.length, count: signals.length }
}
