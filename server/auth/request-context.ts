export type RequestContext = {
  userId: string
  isAdmin: boolean
}

export function getRequestContext(req: Request): RequestContext {
  return {
    userId: req.headers.get('x-user-id') ?? 'demo-user',
    isAdmin: req.headers.get('x-admin') === 'true',
  }
}
