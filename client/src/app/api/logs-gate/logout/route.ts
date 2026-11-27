import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const res = NextResponse.redirect(new URL('/', request.url))
  res.cookies.set('logs_session', '', {
    httpOnly: true,
    path: '/logs',
    maxAge: 0,
  })
  return res
}
