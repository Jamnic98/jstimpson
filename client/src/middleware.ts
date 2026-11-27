import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const expected = process.env.LOGS_ACCESS_TOKEN
  const session = request.cookies.get('logs_session')?.value

  if (expected && session === expected) {
    return NextResponse.next()
  }

  const gateUrl = new URL('/logs-gate', request.url)
  gateUrl.searchParams.set('next', request.nextUrl.pathname)
  return NextResponse.redirect(gateUrl)
}

export const config = {
  matcher: ['/logs/:path*'],
}
