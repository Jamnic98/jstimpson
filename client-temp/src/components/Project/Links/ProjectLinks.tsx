import Link from 'next/link'
import { CgExternal, CgInternal } from 'react-icons/cg'

import { LinkType, type ProjectLink } from 'types'

export interface ProjectLinksProps {
  links: ProjectLink[]
}

export const ProjectLinks: React.FC<ProjectLinksProps> = ({ links }) => (
  <nav className="inset-0 flex flex-wrap text-xl font-medium">
    {links.map((link, index) => {
      if (link.type === LinkType.EXTERNAL) {
        return (
          <a
            className="group mr-2 mb-2 flex w-full justify-center rounded bg-neutral-50 px-12 py-2 shadow sm:w-max"
            href={link.URL}
            target="_blank"
            rel="noreferrer"
            key={index}
          >
            <span className="flex flex-row text-xl text-orange-600 group-hover:text-gray-950">
              {link.label} <CgExternal className="text-2xl" />
            </span>
          </a>
        )
      } else if (link.type === LinkType.INTERNAL) {
        return (
          <Link
            className="flex justify-center rounded bg-neutral-50 px-12 py-2 text-xl font-semibold text-orange-600 shadow hover:text-gray-950"
            href={link.URL}
            key={index}
          >
            <span className="flex flex-row">
              {link.label} <CgInternal className="text-2xl" />
            </span>
          </Link>
        )
      }
    })}
  </nav>
)
