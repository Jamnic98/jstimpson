import { FaGithub, FaLinkedin } from 'react-icons/fa'

import { PERSONAL_GITHUB_URL, PERSONAL_LINKEDIN_URL } from 'utils'

export const Footer: React.FC = () => (
  <div
    id="footer"
    className="sticky inset-x-0 top-[100vh] flex h-20 items-center justify-center bg-gray-950"
    aria-label="footer"
  >
    <nav className="text-neutral flex space-x-8 text-4xl">
      <a
        href={PERSONAL_GITHUB_URL}
        target="_blank"
        rel="noreferrer"
        className="hover:text-orange-600"
      >
        <FaGithub />
      </a>
      <a
        href={PERSONAL_LINKEDIN_URL}
        target="_blank"
        rel="noreferrer"
        className="hover:text-orange-600"
      >
        <FaLinkedin />
      </a>
    </nav>
  </div>
)
