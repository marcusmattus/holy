export type HolyAppUser = {
  id: string
  email: string
  name?: string
}

function isHolyAppUser(value: unknown): value is HolyAppUser {
  return Boolean(
    value &&
      typeof value === 'object' &&
      typeof (value as { id?: unknown }).id === 'string' &&
      typeof (value as { email?: unknown }).email === 'string'
  )
}

export function getUser(): HolyAppUser | null {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem('holy_app_user')
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as unknown
    return isHolyAppUser(parsed) ? parsed : null
  } catch {
    return null
  }
}
