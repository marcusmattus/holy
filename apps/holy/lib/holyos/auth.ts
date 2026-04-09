export async function signIn(_email: string, _password: string) {
  // TODO: connect to HolyOS auth
  return { token: 'mock-token', user: { id: '1', name: 'Builder', email: _email } }
}

export async function signOut() {
  // TODO: connect to HolyOS auth
}

export async function getSession() {
  return null
}
