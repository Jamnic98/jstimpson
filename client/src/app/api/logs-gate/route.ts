import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'

export async function POST(request: NextRequest) {
  const expected = process.env.LOGS_ACCESS_TOKEN
  if (!expected) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }

  let token = ''
  try {
    const body = await request.json()
    token = String(body?.token ?? '')
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const a = Buffer.from(token)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('logs_session', expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/logs',
    maxAge: 60 * 60 * 24 * 30,
  })
  return res
}
