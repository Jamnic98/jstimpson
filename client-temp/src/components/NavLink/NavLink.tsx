'use client'

import Link from 'next/link'

import { MOBILE_SCREEN_WIDTH, useWidth } from 'utils'
import { type NavLinkData } from 'types'

interface NavlinkProps {
  navlinkObj: NavLinkData
  onClick?: () => void
}

export const NavLink: React.FC<NavlinkProps> = ({ navlinkObj, onClick }) => {
  const { label, url /* , children  */ } = navlinkObj

  const isMobile = (useWidth() || MOBILE_SCREEN_WIDTH) < MOBILE_SCREEN_WIDTH

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <Link
      href={url}
      onClick={handleClick}
      className={`${isMobile ? 'py-4' : ''} flex items-center justify-center px-3.5 text-2xl font-bold text-white hover:bg-orange-600 lg:px-6`}
    >
      {label}
    </Link>
    // <>
    //   {children.length ? (
    //     <Link
    //       href={url}
    //       className="flex items-center justify-center text-3xl font-bold text-neutral-light hover:bg-orange-600"
    //       onMouseOver={() => setIsActive(true)}
    //       onMouseOut={() => setIsActive(false)}
    //       onClick={handleClick}
    //     >
    //       {label}
    //       {/* <Dropdown
    //         isOpen={isActive}
    //         items={children}
    //         render={(navlinkObj: NavLinkData) => (
    //           <Link className={styles.navlink} href={navlinkObj.url}>
    //             {navlinkObj.label}
    //           </Link>
    //         )}
    //       /> */}
    //     </Link>
    //   ) : (

    //   )}
    // </>
  )
}
