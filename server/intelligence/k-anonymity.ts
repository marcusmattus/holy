export function meetsMinimumSampleSize(sampleSize: number, minimum = 10) {
  return sampleSize >= minimum
}
