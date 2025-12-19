import { LinkType, type Project } from 'types'
import { projectImagesFolderPaths } from 'utils/constants'

const projectId = 'typation'

const typation: Project = {
  id: projectId,
  title: 'Typation',
  summary: 'An adaptive typing program to improve speed and accuracy.',
  paragraphs: [
    `The idea behind this project was to build an application that analyses the user's typing patterns and presents them with words containing combinations of letters they struggle with—aiming to accelerate their improvement over time.
   To test this hypothesis, I created a typing interface using React with Vite on the frontend, and a backend now written in Python and FastAPI. The system tracks hits and misses on individual letters and letter combinations, storing the data in JSON format for later analysis.
   There's also a Python-based text generation service that dynamically provides personalised practice words based on the user's performance. Redis is used as a job queue to handle requests to the text generation service asynchronously, helping keep the app responsive.`,

    `To manage the project infrastructure, I’m using Docker and Docker Compose to containerise and orchestrate the various services. After collecting my own typing data by using the app, I wrote a Python script to extract and visualise the data using Matplotlib.
   While I initially put the project on hold due to similarities with another site I drew inspiration from, I've since resumed development, and the project is currently a work in progress.`,

    `One of the most rewarding aspects of building and using this app has been seeing measurable improvements in my own typing speed and accuracy.
   Thanks to the trend data and analytics built into the system, I can track progress over time in words per minute, accuracy percentages, and even detailed digraph and character-level performance.
   This level of feedback not only highlights areas where I can improve but also motivates me to keep practising, as I can literally see my progress visualised over time.`,

    `The live app is already available, and I am actively working to make it fully production-ready for new users.
   I’m excited to continue onboarding people to the app, gather feedback, and evolve it into a polished platform that helps others improve their typing skills just as it has helped me.`,
  ],
  projectPageURI: `/coding/${projectId}`,
  screenshotURIs: [
    `${projectImagesFolderPaths.typation}/typing_widget.webp`,
    `${projectImagesFolderPaths.typation}/session_summary.webp`,
    `${projectImagesFolderPaths.typation}/statistical_trends.webp`,
    `${projectImagesFolderPaths.typation}/stats_graph.webp`,
  ],
  mainLanguage: ['TypeScript', 'Python'],
  links: [
    {
      URL: `https://${projectId}.co.uk`,
      label: 'Live Project',
      type: LinkType.EXTERNAL,
    },
    {
      URL: `https://github.com/Jamnic98/${projectId}`,
      label: 'GitHub Repo',
      type: LinkType.EXTERNAL,
    },
  ],
  techStack: [
    'TypeScript',
    'React',
    'Vite',
    'Python',
    'FastAPI',
    'GraphQL',
    'PostgreSQL',
    'Docker',
    'Docker Compose',
    'React Testing Library',
    'Vitetest',
    'Pytest',
    'HTML',
    'CSS',
    'JSON',
  ],
  readmePath: `https://raw.githubusercontent.com/Jamnic98/${projectId}/refs/heads/main/README.md`,
}

export default typation
