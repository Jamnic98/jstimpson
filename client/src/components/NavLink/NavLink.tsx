'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { IoChevronDown } from 'react-icons/io5'

import { MOBILE_SCREEN_WIDTH, useWidth } from '@/utils'
import { type NavLinkData } from '@/types'

interface NavlinkProps {
  navlinkObj: NavLinkData
  onClick?: () => void
}

const linkClasses = (isActive: boolean) =>
  `relative flex items-center justify-center gap-1.5 px-4 py-3 font-mono text-sm font-semibold
   uppercase tracking-widest transition-colors duration-300 w-full bg-neutral-50
   ${isActive ? 'text-orange-500' : 'text-gray-600 hover:text-orange-600'}`

export const NavLink: React.FC<NavlinkProps> = ({ navlinkObj, onClick }) => {
  const { label, url, children } = navlinkObj
  const pathname = usePathname()
  const width = useWidth() || MOBILE_SCREEN_WIDTH
  const isMobile = width < MOBILE_SCREEN_WIDTH
  const [isDropdownOpen, setDropdownOpen] = useState(false)

  const isActive = pathname === url || children?.some((c) => c.url === pathname)

  const handleMouseEnter = () => {
    if (!isMobile && children?.length) setDropdownOpen(true)
  }
  const handleMouseLeave = () => {
    if (!isMobile && children?.length) setDropdownOpen(false)
  }
  const handleParentClick = () => {
    if (isMobile && children?.length) setDropdownOpen((prev) => !prev)
  }

  if (children?.length) {
    return (
      <div
        className="relative w-full bg-neutral-50"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span onClick={handleParentClick} className={`${linkClasses(!!isActive)} cursor-pointer`}>
          {label}
          <IoChevronDown
            className={`h-3 w-3 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </span>

        <div
          className={`flex flex-col overflow-hidden transition-[max-height] duration-300 ease-out bg-neutral-50
            ${isMobile ? '' : 'absolute left-0 top-full z-20 min-w-full rounded-md'}`}
          style={{ maxHeight: isDropdownOpen ? `${children.length * 44}px` : '0px' }}
        >
          {children.map((child) => (
            <Link
              key={child.label}
              href={child.url}
              onClick={() => {
                setDropdownOpen(false)
                onClick?.()
              }}
              className="flex h-11 items-center justify-center px-4 font-mono text-xs uppercase bg-neutral-50
                tracking-widest text-gray-500 transition-colors hover:text-orange-500"
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Link href={url} onClick={onClick} className={linkClasses(!!isActive)}>
      {label}
    </Link>
  )
}
