import Link from 'next/link'
import { IoOpenOutline, IoLogoGithub, IoArrowForward } from 'react-icons/io5'

import { LinkType, type ProjectLink } from '@/types'

export interface ProjectLinksProps {
  links: ProjectLink[]
}

const baseClasses =
  'inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 font-mono text-[11px] ' +
  'uppercase tracking-wide leading-none transition-colors'

const iconClasses = 'h-4 w-4 shrink-0 transform translate-y-[-2px]'

const secondaryClasses =
  'border border-neutral-300 text-neutral-500 hover:border-orange-500 hover:text-orange-600'

const primaryClasses = 'bg-orange-600/10 text-orange-500 hover:bg-orange-600/20'

export const ProjectLinks: React.FC<ProjectLinksProps> = ({ links }) => (
  <nav className="flex flex-wrap gap-2">
    {links.map((link, index) => {
      switch (link.type) {
        case LinkType.LIVE:
          return (
            <a
              key={index}
              href={link.URL}
              target="_blank"
              rel="noreferrer"
              className={`${baseClasses} ${primaryClasses}`}
            >
              <span>{link.label}</span>
              <IoOpenOutline className={iconClasses} />
            </a>
          )

        case LinkType.REPO:
          return (
            <a
              key={index}
              href={link.URL}
              target="_blank"
              rel="noreferrer"
              className={`${baseClasses} ${secondaryClasses}`}
            >
              <span>{link.label}</span>
              <IoLogoGithub className={iconClasses} />
            </a>
          )

        case LinkType.EXTERNAL:
          return (
            <a
              key={index}
              href={link.URL}
              target="_blank"
              rel="noreferrer"
              className={`${baseClasses} ${secondaryClasses}`}
            >
              <span>{link.label}</span>
              <IoOpenOutline className={iconClasses} />
            </a>
          )

        case LinkType.INTERNAL:
          return (
            <Link key={index} href={link.URL} className={`${baseClasses} ${secondaryClasses}`}>
              <span>{link.label}</span>
              <IoArrowForward className={iconClasses} />
            </Link>
          )

        default:
          return null
      }
    })}
  </nav>
)
