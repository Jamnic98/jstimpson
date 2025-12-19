import { LinkType, type Project } from 'types'
import { projectImagesFolderPaths } from 'utils/constants'

const projectId = 'pyramid-solitaire'

const pyramidSolitaire: Project = {
  id: projectId,
  title: 'Pyramid Solitaire',
  summary: 'A program based on a variation of the card game, solitaire.',
  paragraphs: [
    `This program was written in Python using the Pygame library. It features animated sprites, with movements and interactions handled through vector mathematics to create smoother and more realistic motion.
     One of the key features I implemented was the ability for the game to detect when no further moves were available, allowing it to automatically trigger an end state or reset the board.
     Developing this functionality required careful tracking of the game state and checking for possible moves after each action.`,

    `This project helped deepen my understanding of game loops, event handling, collision detection, and basic game logic within Pygame.
     It also gave me valuable experience in applying mathematical concepts to programming challenges in a practical, visual way.`,
  ],
  projectPageURI: `/coding/${projectId}`,
  screenshotURIs: [
    `${projectImagesFolderPaths.pyramidSolitaiere}/mid_game.webp`,
    `${projectImagesFolderPaths.pyramidSolitaiere}/game_over.webp`,
    `${projectImagesFolderPaths.pyramidSolitaiere}/title_screen.webp`,
  ],
  mainLanguage: ['Python'],
  links: [
    {
      label: 'GitHub Repo',
      URL: `https://github.com/Jamnic98/${projectId}`,
      type: LinkType.EXTERNAL,
    },
  ],
  techStack: ['Python', 'Pygame'],
  readmePath: `https://raw.githubusercontent.com/Jamnic98/${projectId}/refs/heads/main/README.md`,
}

export default pyramidSolitaire
