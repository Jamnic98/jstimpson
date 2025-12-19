'use client'

export interface HeaderProps {
  children: React.ReactNode
}

export const Header: React.FC<HeaderProps> = ({ children }) => (
  <div id="header" className="sticky top-0 z-10 h-16 bg-gray-950" aria-label="header">
    <div
      id="header-content"
      className="container mx-auto flex h-full max-w-(--breakpoint-xl) flex-row items-center justify-between px-8"
    >
      {children}
    </div>
  </div>
)
