import { LinkType, type Project } from 'types'

import { projectImagesFolderPaths } from 'utils/constants'

const projectId = 'eye-tracker'

const eyeTracker: Project = {
  id: projectId,
  title: 'Eye Tracker',
  summary:
    'A full-stack web application designed to detect, calibrate, and analyse horizontal eye movement in real time.',
  paragraphs: [
    `This project was created as a tech test submission for a company looking to track horizontal eye movement using a modern web application. The goal was to build a full-stack solution that could capture, calibrate, and visualise gaze data in real time through the browser.`,

    `The frontend is built with React, Vite, and TypeScript for fast iteration and strong type safety. Eye movement is detected using a TensorFlow.js-based NPM package, which wraps a pre-trained facial landmark model. This allows the app to estimate gaze direction without training a custom model. The user completes a short calibration sequence before recording begins.`,

    `Live gaze data is visualised using Chart.js, chosen for its ease of integration and smooth animations. The chart supports both real-time updates during a session and playback functionality for reviewing recorded data.`,

    `The backend is powered by FastAPI, offering a clean, asynchronous API with built-in validation through Pydantic. Data is stored in MongoDB, with a clear separation between session metadata and time-series eye tracking data. Each session is uniquely identified and can be exported in JSON format for further analysis.`,

    `All services are containerised using Docker and orchestrated with Docker Compose, making the app easy to run locally or deploy to cloud platforms like AWS EC2. This project showcases my ability to integrate machine learning into web applications and deliver responsive, interactive user experiences with a modern tech stack.`,
  ],
  projectPageURI: '/coding/eye-tracker',
  screenshotURIs: [
    `${projectImagesFolderPaths.eyeTracker}/chart.webp`,
    `${projectImagesFolderPaths.eyeTracker}/calibration.webp`,
    `${projectImagesFolderPaths.eyeTracker}/capture.webp`,
  ],
  mainLanguage: ['TypeScript', 'Python'],
  links: [
    {
      label: 'GitHub',
      URL: `https://github.com/Jamnic98/${projectId}`,
      type: LinkType.EXTERNAL,
    },
  ],
  techStack: ['TypeScript', 'Python', 'Tensorflow.js', 'Chart.js', 'FastApi', 'MongoDB'],
  // readmePath: `https://raw.githubusercontent.com/Jamnic98/${projectId}/refs/heads/main/README.md`,
}

export default eyeTracker
