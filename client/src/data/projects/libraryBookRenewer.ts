import { LinkType, type Project } from 'types'
import { projectImagesFolderPaths } from 'utils/constants'

const projectId = 'library-book-renewer'

const libraryBookRenewer: Project = {
  id: projectId,
  title: 'Library Book Renewer',
  summary: 'A web scraper that automatically renews my library books.',
  paragraphs: [
    `This project was written in Python and uses the Selenium web scraping library to log into my library account and renew all the books that are due.
     The idea came to me when joking with my sister that I bet I could write a program to renew books I had loaned from the library.`,

    `Once the program was built and ran reliably, I set up a Raspberry Pi to run the program on a daily basis from a cron job.
     The program check if there are any books due and selectively renews the ones that are. It also sends a confirmation email with information about which books it renewed.
     The program is coded using functions corresponding to the actions a user would take, like logging in, navigating to different pages, collecting information on current holds and logging out.
     By coding it this way and using try except blocks with error handling, the program will email me if any errors occur with a description on where the problem occured and why.
     My main concern was that the site might be updated and the HTML changed, which would break the program.
     I didn't want to be incurring late fees for books I had reserved, thinking the program was working when it wasn't.`,

    `The hardest part of the project was getting the program to work on the Raspberry Pi.
     Without a GUI to display the browser, I had to use a headless browser to run the program, which made it difficult to debug.
     I also had trouble installing Chromedriver on the Raspberry Pi, as it uses a different architecture from my laptop.
     Another issue was that the Pi ran much slower than the computer I had used to develop the program, which meant that the program might attempt to search for a page element which hadn't yet loaded.
     To overcome this, I had to add a lot of timeouts and waits to ensure that the page had fully loaded before attempting to interact with it.`,

    `This project was a great way to learn about web scraping and how to use Selenium. I also learnt a lot about using the Raspberry Pi and how to set up cron jobs to run scripts automatically.`,
  ],
  projectPageURI: `/coding/${projectId}`,
  screenshotURIs: [`${projectImagesFolderPaths.libraryBookRenewer}/code.webp`],
  mainLanguage: ['Python'],
  links: [
    {
      label: 'GitHub Repo',
      URL: `https://github.com/Jamnic98/${projectId}`,
      type: LinkType.EXTERNAL,
    },
  ],
  techStack: ['Python', 'Selenium'],
  // readmePath:
  //   'https://raw.githubusercontent.com/Jamnic98/library-book-auto-renewer/refs/heads/main/README.md',
}

export default libraryBookRenewer
