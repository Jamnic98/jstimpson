import { LinkType, type Project } from 'types'
import { projectImagesFolderPaths } from 'utils/constants'

const projectId = 'ollama-chat-app'

const ollamaChatApp: Project = {
  id: projectId,
  title: 'Ollama Chat App',
  summary:
    'A desktop Electron app for interacting with local Ollama AI models through a sleek chat interface',
  paragraphs: [
    `Ollama Chat App is a desktop Electron app that lets you run and interact with local Ollama AI models in a clean, intuitive chat interface.
     Users can download models directly within the app, with clear progress indicators for both overall download status and individual model layers.
     Once a model is selected, the chat interface streams responses in real time and displays them in Markdown, allowing rich formatting and readability.
      The interface is designed to keep interactions simple and focused, allowing users to manage multiple models and switch between them easily.`,
    `Future development aims to extend the app with features such as saving and loading past chats, adding speech-to-text and text-to-speech capabilities for more natural
     conversations, and supporting media insertion. This includes enabling models to generate and display images, further enriching the interactive experience.`,
  ],
  projectPageURI: `/coding/${projectId}`,
  screenshotURIs: [
    `${projectImagesFolderPaths.ollamaChatApp}/models.webp`,
    `${projectImagesFolderPaths.ollamaChatApp}/chat_interface.webp`,
  ],
  mainLanguage: ['TypeScript'],
  links: [
    {
      label: 'GitHub Repo',
      URL: `https://github.com/Jamnic98/${projectId}`,
      type: LinkType.EXTERNAL,
    },
  ],
  techStack: ['Ollama', 'TypeScript', 'React', 'Vite', 'Electron'],
  readmePath: `https://raw.githubusercontent.com/Jamnic98/${projectId}/refs/heads/main/README.md`,
}

export default ollamaChatApp
