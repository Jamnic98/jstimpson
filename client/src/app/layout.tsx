'use client'

import { useState } from 'react'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { Footer, Header, MenuToggle, NavLogo, NavLink } from '@/components'
import { MOBILE_SCREEN_WIDTH, navLinkDataArr, useWidth } from '@/utils'
import { type NavLinkData } from '@/types'

import '@/styles/tailwind.css'

const inter = Inter({ subsets: ['latin'] })

const RootLayout: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleOnClick = () => setIsOpen(!isOpen)

  const width = useWidth()
  const isMobile = width && width < MOBILE_SCREEN_WIDTH

  return (
    <html lang="en" className={inter.className}>
      <body className="bg-neutral-950 flex min-h-screen flex-col">
        <Header>
          <NavLogo />

          {width &&
            (isMobile ? (
              <div
                className={`fixed inset-x-0 top-14 z-30 max-h-[calc(100vh-4rem)] overflow-hidden
                  ${isOpen ? '' : 'pointer-events-none'}`}
              >
                <nav
                  className={`flex w-full flex-col overflow-y-auto bg-neutral-50 font-mono
                    shadow-lg transition-transform duration-300 ease-out
                    ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}
                >
                  {navLinkDataArr.map((navLinkData: NavLinkData) => (
                    <NavLink
                      onClick={() => setIsOpen(false)}
                      navlinkObj={navLinkData}
                      key={navLinkData.label}
                    />
                  ))}
                </nav>
              </div>
            ) : (
              <nav className="flex h-full items-center bg-transparent transition-none">
                {navLinkDataArr.map((navLinkData: NavLinkData) => (
                  <NavLink navlinkObj={navLinkData} key={navLinkData.label} />
                ))}
              </nav>
            ))}

          <MenuToggle isOpen={isOpen} onClick={handleOnClick} />
        </Header>

        <main className="container mx-auto max-w-(--breakpoint-xl) px-8 pt-16">{children}</main>

        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

export default RootLayout
