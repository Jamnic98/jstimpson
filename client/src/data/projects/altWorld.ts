import { LinkType, type Project } from 'types'

import { projectImagesFolderPaths } from 'utils/constants'

const projectId = 'alt-world'

const altWorld: Project = {
  id: projectId,
  title: 'Alt World',
  summary: 'A custom, mobile-responsive website I built for a client.',
  paragraphs: [
    `This is a custom-built web project I created for a client, making use of Next.js, TypeScript, TailwindCSS, and MongoDB. Prior to starting, the client and I had an in-depth discussion about the scope of the project, key features and overall design.
      With the information gathered, I decided to leverage Next.js for its static site generation features and powerful SEO tooling to ensure an optimal user experience and search engine visibility. 
      The implementation of Next.js' built-in Image optimization would also complement the visual aspect of this image-rich website.
      Using TailwindCSS I was able to make a mobile-responsive design that caters to various devices and screen sizes.
      With Next.js' API I set up a simple endpoint and integrated database functionality to store data from a mailing list form.
      Overall, "Alt World" demonstrates a modern, performant, and visually appealing web presence tailored to the client's needs and expectations.`,
  ],
  projectPageURI: `/coding/${projectId}`,
  screenshotURIs: [
    `${projectImagesFolderPaths.altWorld}/home.webp`,
    `${projectImagesFolderPaths.altWorld}/platform.webp`,
    `${projectImagesFolderPaths.altWorld}/studio.webp`,
    `${projectImagesFolderPaths.altWorld}/case_studies.webp`,
  ],
  mainLanguage: ['TypeScript'],
  links: [
    {
      label: 'GitHub Repo',
      URL: `https://github.com/Jamnic98/${projectId}`,
      type: LinkType.EXTERNAL,
    },
    {
      label: 'Live App',
      URL: 'https://altworld.net',
      type: LinkType.EXTERNAL,
    },
  ],
  techStack: ['TypeScript', 'Next.js', 'TailwindCSS', 'MongoDB'],
  readmePath: `https://raw.githubusercontent.com/Jamnic98/${projectId}/refs/heads/main/README.md`,
}

export default altWorld
