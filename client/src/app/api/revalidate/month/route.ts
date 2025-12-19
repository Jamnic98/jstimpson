// app/api/revalidate/month/route.ts
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST() {
  revalidatePath('/')

  return NextResponse.json({ revalidated: true })
}
