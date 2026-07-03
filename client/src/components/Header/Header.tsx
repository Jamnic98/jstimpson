'use client'

export interface HeaderProps {
  children: React.ReactNode
}

export const Header: React.FC<HeaderProps> = ({ children }) => (
  <div id="header" className="sticky top-0 z-50 h-14 bg-gray-50" aria-label="header">
    <div
      id="header-content"
      className="container mx-auto flex h-full max-w-(--breakpoint-xl) flex-row items-center justify-between px-8"
    >
      {children}
    </div>
  </div>
)
