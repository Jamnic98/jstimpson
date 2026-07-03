export enum LinkType {
  LIVE = 'live',
  REPO = 'repo',
  EXTERNAL = 'external',
  INTERNAL = 'internal',
}

export type ProjectLink = {
  URL: string
  label: string
  type: LinkType
}

export type Project = {
  id: string
  title: string
  summary: string
  paragraphs: string[]
  projectPageURI: string
  screenshotURIs: string[]
  mainLanguage: string[]
  links: ProjectLink[]
  techStack: string[]
  readmePath?: string
}
