import { LinkType, type Project } from 'types'
import { projectImagesFolderPaths } from 'utils/constants'

const ticTacGoProjectId = 'tic-tac-go'

const ticTacGo: Project = {
  id: ticTacGoProjectId,
  title: 'Tic Tac Go',
  summary: 'A command line interface version of tic tac toe, written in Go.',
  paragraphs: [
    `I wrote this program while travelling by aeroplane to Italy as a way to pass the time productively.
     It also served as an opportunity for me to practise my Go programming skills, which I had started learning a few weeks earlier.
     The program is a simple two-player game that runs in the command line, where players take turns making moves against each other.
     It includes input validation to ensure that only valid moves are accepted, and performs checks after each move to determine whether a winning condition has been met.`,

    `Developing this project helped me to reinforce core concepts in Go, such as working with slices, handling user input, and structuring programmes using functions and control flow.
     It also gave me a better understanding of error handling in Go and the importance of writing clear, maintainable code for interactive applications.`,
  ],

  projectPageURI: `/coding/${ticTacGoProjectId}`,
  screenshotURIs: [
    `${projectImagesFolderPaths.ticTacGo}/code.webp`,
    `${projectImagesFolderPaths.ticTacGo}/gameplay.webp`,
  ],
  mainLanguage: ['Golang'],
  links: [
    {
      URL: `https://github.com/Jamnic98/${ticTacGoProjectId}`,
      label: 'GitHub Repo',
      type: LinkType.EXTERNAL,
    },
  ],
  techStack: ['Golang'],
}

export default ticTacGo
