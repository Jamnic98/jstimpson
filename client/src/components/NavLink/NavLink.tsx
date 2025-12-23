'use client'

import Link from 'next/link'
import { useState } from 'react'
import { MOBILE_SCREEN_WIDTH, useWidth } from 'utils'
import { type NavLinkData } from 'types'

interface NavlinkProps {
  navlinkObj: NavLinkData
  onClick?: () => void // closes mobile menu when selecting a child link
}

export const NavLink: React.FC<NavlinkProps> = ({ navlinkObj, onClick }) => {
  const { label, url, children } = navlinkObj
  const width = useWidth() || MOBILE_SCREEN_WIDTH
  const isMobile = width < MOBILE_SCREEN_WIDTH
  const [isDropdownOpen, setDropdownOpen] = useState(false)

  const itemHeight = 'h-16' // all items same height

  const handleParentClick = () => {
    if (isMobile && children.length) {
      setDropdownOpen(!isDropdownOpen)
    }
  }

  const handleChildClick = () => {
    if (onClick) onClick() // closes mobile menu
    setDropdownOpen(false)
  }

  const handleMouseEnter = () => {
    if (!isMobile && children.length) setDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    if (!isMobile && children.length) setDropdownOpen(false)
  }

  if (children.length) {
    return (
      <div className="w-full" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {/* Parent tab */}
        <span
          onClick={handleParentClick}
          className={`flex items-center justify-center ${itemHeight} px-4 text-2xl font-bold text-white cursor-pointer hover:bg-orange-600 w-full`}
        >
          {label}
          <span
            className={`inline-block ml-2 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
            style={{ fontSize: '0.8em' }}
          >
            ▼
          </span>
        </span>

        {/* Dropdown menu */}
        <div
          className="flex flex-col overflow-hidden transition-[max-height] duration-300 ease-out"
          style={{
            maxHeight: isDropdownOpen ? `${children.length * 64}px` : '0', // 64px per item
          }}
        >
          {children.map((child) => (
            <Link
              key={child.label}
              href={child.url}
              onClick={handleChildClick}
              className={`flex items-center justify-${isMobile ? 'start' : 'center'} ${itemHeight} px-4 text-2xl font-bold text-white bg-gray-950 hover:bg-orange-600 w-full`}
              style={{ paddingLeft: isMobile ? '2rem' : '1rem' }} // optional: keep indent on mobile
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    )
  }

  // Normal link
  return (
    <Link
      href={url}
      onClick={onClick}
      className={`flex items-center justify-center ${itemHeight} px-4 text-2xl font-bold text-white hover:bg-orange-600 w-full`}
    >
      {label}
    </Link>
  )
}
