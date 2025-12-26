'use client'

import Link from 'next/link'

import { MOBILE_SCREEN_WIDTH, useWidth } from 'utils'

export interface NavLogoProps {
  linkURL?: string
}

export const NavLogo: React.FC<NavLogoProps> = ({ linkURL = '/' }) => {
  const width = useWidth()

  return (
    <Link
      className="hover:text-neutral text-4xl font-bold tracking-wide text-orange-600 transition-colors duration-300 ease-in-out outline-none"
      href={linkURL}
    >
      {width && (width < MOBILE_SCREEN_WIDTH ? 'JS' : 'Jamie Stimpson')}
    </Link>
  )
}
