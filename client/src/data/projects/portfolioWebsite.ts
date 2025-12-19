import { LinkType, type Project } from 'types'
import { projectImagesFolderPaths } from 'utils/constants'

const diffInMilliseconds = new Date().getTime() - new Date('2022-01-31').getTime()
const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25
const yearsSinceDeployment = Math.floor(diffInMilliseconds / millisecondsInYear)

const projectId = 'portfolio-website'

const portfolioWebsite: Project = {
  id: projectId,
  title: 'Portfolio Website',
  summary:
    'A Full Stack web application for showcasing my coding skills, 3D modelling skills and running stats.',
  paragraphs: [
    `This website has undergone extensive updates since I first deployed it ${yearsSinceDeployment} years ago.
     The first version was built with just React as a single page application and styled with pure CSS.
     As I wanted to record my running data I transitioned to a full stack application using Node.js and Express for the backend, and MongoDB for the database.
     I also switched to Next.js for the frontend, which allowed me to use server-side rendering and static site generation.
     This made the site much faster and more efficient, especially for the project pages which are now generated dynamically.
     A similar approach of dynamic data loading is used to create the project 'cards' displayed on the main projects page.`,

    `Another major change was the switch from CSS to TailwindCSS for styling.
     This allowed me to use utility classes to style the components, which made the code much cleaner and easier to maintain.
     I also completely rewrote the backend logic in Python using FastAPI, as I wanted to simplify the development process for adding new features in the future, as well as being able to use Python data science libraries to process my running data.`,

    `This website is an ongoing project, and I am continually adding new features and improving the design.`,
  ],

  projectPageURI: `/coding/${projectId}`,
  screenshotURIs: [
    `${projectImagesFolderPaths.portfolioWebsite}/home_page.webp`,
    `${projectImagesFolderPaths.portfolioWebsite}/projects_page.webp`,
    `${projectImagesFolderPaths.portfolioWebsite}/about_page.webp`,
  ],
  mainLanguage: ['TypeScript', 'Python'],
  links: [
    {
      URL: 'https://github.com/Jamnic98/jstimpson-client',
      label: 'GitHub Repo',
      type: LinkType.EXTERNAL,
    },
  ],
  techStack: [
    'TypeScript',
    'Python',
    'Next.js',
    'HTML',
    'TailwindCSS',
    'FastAPI',
    'Vercel',
    'AWS Lambda',
    'MongoDB Atlas',
    'D3.js',
    'Jest',
    'React Testing Library',
    'Pytest',
    "Strava's API",
  ],
  readmePath: `https://raw.githubusercontent.com/Jamnic98/jstimpson-client/refs/heads/main/README.md`,
}

export default portfolioWebsite
