import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login', '/register']
const PROTECTED_PREFIX = '/dashboard'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session = req.cookies.get('session')?.value

  if (pathname.startsWith(PROTECTED_PREFIX) && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (PUBLIC_PATHS.includes(pathname) && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}
