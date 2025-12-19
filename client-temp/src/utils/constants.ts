import type { NavLinkData } from 'types'

export const navLinkDataArr: NavLinkData[] = [
  { label: '3D', url: '/3d', children: [] },
  { label: 'coding', url: '/coding', children: [] },
  {
    label: 'logs',
    url: '/logs',
    children: [
      // { label: 'running', url:  '/logs/running', children: [] },
      // { label: 'weight lifting', url: '/logs/weight-lifting', children: [] },
      // { label: 'habit tracker', url: '/logs/habit-tracker', children: [] },
      // { label: 'reading', url: '/logs/reading', children: [] }
    ],
  },
  { label: 'about ', url: '/about', children: [] },
]

export const MOBILE_SCREEN_WIDTH = 768

export const PERSONAL_GITHUB_URL = 'https://github.com/Jamnic98?tab=repositories'

export const PERSONAL_LINKEDIN_URL = 'https://linkedin.com/in/jamie-p-stimpson/'

export const AI_HACKATHON_URL =
  'https://www.encode.club/ai-hackathon#:~:text=London%2C%20March%208%2D10th%202024,Pl%2C%20London%2C%20E14%205RE.'

export const AI_ADVENTURE_WRLD_GITHUB_URL = 'https://github.com/duybuile/ai-text-game'

export const LOREM_IPSUM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

export const PROFILE_PICTURE_FOLDER_PATH = '/images/profile-picture'

const PROJECT_IMAGES_FOLDER_PATH = '/images/projects'

export const projectImagesFolderPaths = {
  altWorld: `${PROJECT_IMAGES_FOLDER_PATH}/alt-world`,
  blueCheeseClassifier: `${PROJECT_IMAGES_FOLDER_PATH}/blue-cheese-classifier`,
  cryptoViewer: `${PROJECT_IMAGES_FOLDER_PATH}/crypto-viewer`,
  eyeTracker: `${PROJECT_IMAGES_FOLDER_PATH}/eye-tracker`,
  inventoryManagementSystem: `${PROJECT_IMAGES_FOLDER_PATH}/inventory-management-system`,
  libraryBookRenewer: `${PROJECT_IMAGES_FOLDER_PATH}/library-book-renewer`,
  looseChangeCalculator: `${PROJECT_IMAGES_FOLDER_PATH}/loose-change-calculator`,
  ollamaChatApp: `${PROJECT_IMAGES_FOLDER_PATH}/ollama-chat-app`,
  pokerPreFlopSimulator: `${PROJECT_IMAGES_FOLDER_PATH}/poker-pre-flop-simulator`,
  portfolioWebsite: `${PROJECT_IMAGES_FOLDER_PATH}/portfolio-website`,
  pyramidSolitaiere: `${PROJECT_IMAGES_FOLDER_PATH}/pyramid-solitaire`,
  readingLog: `${PROJECT_IMAGES_FOLDER_PATH}/reading-log`,
  scrabbleScorekeeper: `${PROJECT_IMAGES_FOLDER_PATH}/scrabble-scorekeeper`,
  ticTacGo: `${PROJECT_IMAGES_FOLDER_PATH}/tic-tac-go`,
  typation: `${PROJECT_IMAGES_FOLDER_PATH}/typation`,
  ukGardenBirdClassifierApp: `${PROJECT_IMAGES_FOLDER_PATH}/uk-garden-bird-classifier-app`,
}
