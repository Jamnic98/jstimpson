import { type Metadata } from 'next'

import HomePage from '@/app/home-page'

export const metadata: Metadata = {
  title: 'Home',
}

export default function Page() {
  return <HomePage />
}
