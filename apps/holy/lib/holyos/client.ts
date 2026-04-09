import { API_BASE } from '../constants'

export async function holyFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!res.ok) {
    throw new Error(`HolyOS API error: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}
