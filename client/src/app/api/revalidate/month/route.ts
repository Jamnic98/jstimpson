import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST() {
  // Purges the underlying fetch cache
  revalidateTag('activities', { expire: 0 })
  revalidatePath('/', 'page')
  // Purges the page render cache
  revalidatePath('/logs/[type]', 'page')

  return NextResponse.json({ revalidated: true, now: Date.now() })
}
