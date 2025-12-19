import { LinkType, type Project } from 'types'
import { projectImagesFolderPaths } from 'utils/constants'

const projectId = 'reading-log'

const readingLog: Project = {
  id: projectId,
  title: 'Reading Log',
  summary: 'A list of books the user has read, stored in a MySQL database.',
  paragraphs: [
    `Written in Java, this program interfaces with a MySQL database to store and manage a personal reading list.
     The user can add books they wish to read as well as keep track of books they have already completed.
     For each book entry, the application stores detailed information, including the title, author, a personal rating out of ten, and optional comments or notes about the book.
     The graphical user interface was built using the JavaFX library, providing a clean and responsive design.
     It features functionality such as a search bar that allows for filtering to find specific books based on record data.`,

    `Through this project, I gained valuable experience working with relational databases, writing SQL queries, and designing user-friendly interfaces.
     It also helped me to improve my understanding of JavaFX event handling, data binding, and best practices for integrating a frontend application with a backend database.`,
  ],
  projectPageURI: `/coding/${projectId}`,
  screenshotURIs: [
    `${projectImagesFolderPaths.readingLog}/author_rating_list.webp`,
    `${projectImagesFolderPaths.readingLog}/move_book_modal.webp`,
  ],
  mainLanguage: ['Java'],
  links: [
    {
      label: 'GitHub Repo',
      URL: `https://github.com/Jamnic98/${projectId}`,
      type: LinkType.EXTERNAL,
    },
  ],
  techStack: ['Java', 'JavaFX', 'SQL', 'MySQL'],
  readmePath: `https://raw.githubusercontent.com/Jamnic98/${projectId}/refs/heads/main/README.md`,
}

export default readingLog
