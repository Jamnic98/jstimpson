import { LinkType, type Project } from 'types'
import { projectImagesFolderPaths } from 'utils/constants'

const projectId = 'scrabble-scorekeeper'

const scrabbleScorekeeper: Project = {
  id: projectId,
  title: 'Scrabble Scorekeeper',
  summary: 'A web program for calculating turn scores in Scrabble.',
  paragraphs: [
    `Built with React, this project was created to make playing Scrabble more enjoyable and less time-consuming by offloading the task of calculating player scores to a computer.
     I wanted to eliminate the need for manual scorekeeping, allowing players to focus more on strategy and fun rather than arithmetic.`,

    `The application features an intuitive, easy-to-use graphical user interface, which includes a fully interactive virtual Scrabble board and a dynamic table that tracks and displays player scores in real time.
     Users can place tiles on the board using keystrokes, and the board automatically calculates points based on letter and word multipliers.
     A built-in dictionary is included to validate each word formed, ensuring that only legitimate words are accepted. If an invalid word is attempted, the system immediately prompts the user to make a correction.`,

    `The board, table, and tiles were styled using custom CSS to create a visually appealing and clean design that mirrors the look and feel of a real Scrabble game.
     Building this project strengthened my skills in React component architecture, state management, and event handling, as well as improving my understanding of CSS for responsive, user-friendly interface design.`,
  ],
  projectPageURI: `/coding/${projectId}`,
  screenshotURIs: [
    `${projectImagesFolderPaths.scrabbleScorekeeper}/tiles.webp`,
    `${projectImagesFolderPaths.scrabbleScorekeeper}/score_table.webp`,
    `${projectImagesFolderPaths.scrabbleScorekeeper}/empty_board.webp`,
  ],
  mainLanguage: ['TypeScript'],
  links: [
    {
      label: 'Live App',
      URL: `https://${projectId}.netlify.app/`,
      type: LinkType.EXTERNAL,
    },
    {
      label: 'GitHub Repo',
      URL: `https://github.com/Jamnic98/${projectId}`,
      type: LinkType.EXTERNAL,
    },
  ],
  techStack: ['React', 'TypeScript', 'HTML', 'CSS'],
  readmePath: `https://raw.githubusercontent.com/Jamnic98/${projectId}/refs/heads/master/README.md`,
}

export default scrabbleScorekeeper
