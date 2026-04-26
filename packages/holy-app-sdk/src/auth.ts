export type HolyAppUser = {
  id: string
  email: string
  name?: string
}

export function getUser(): HolyAppUser | null {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem('holy_app_user')
  return raw ? (JSON.parse(raw) as HolyAppUser) : null
}
