import { type Metadata } from 'next'
import Link from 'next/link'
import { LuMoveLeft } from 'react-icons/lu'

import {
  Markdown,
  PageHeader,
  ProjectDescriptions,
  ProjectLinks,
  ProjectGallery,
} from '@/components'
import { fetchReadme } from '@/lib/readme'
import projects_data from '@/data/projects'

interface ProjectProps {
  params: Promise<{ id: string }>
}

const Page = async (props: ProjectProps) => {
  const params = await props.params
  const projectData = getProject({ id: params.id })
  const readme = projectData.readmePath ? await fetchReadme(projectData.readmePath) : null

  return (
    <>
      <PageHeader title={projectData.title} description={projectData.summary} />

      <article className="mb-16 text-white">
        <section className="my-12">
          <p className="mb-4 text-lg space-x-4">
            <span className="font-semibold">Tech stack: </span>
            <span className="font-mono text-emerald-400">
              {projectData.techStack.map((tech: string) => tech).join(', ')}
            </span>
          </p>
        </section>

        {projectData.links.length ? (
          <section className="my-12">
            {/* <h2 className="mb-4 text-xl font-semibold">Project Links</h2> */}
            <ProjectLinks links={projectData.links} />
          </section>
        ) : null}

        <section className="my-12">
          <h2 className="mb-4 text-xl font-semibold">Gallery</h2>
          <ProjectGallery screenshotURIs={projectData.screenshotURIs} />
        </section>

        <section className="my-12">
          <h2 className="mb-4 text-xl font-semibold">Description</h2>
          <ProjectDescriptions paragraphs={projectData.paragraphs} />
        </section>

        {readme ? (
          <section className="my-12">
            <h2 className="mb-4 text-xl font-semibold">GitHub ReadMe</h2>
            <div className=" p-6 bg-neutral-200">
              <Markdown content={readme ?? ''} />
            </div>
          </section>
        ) : null}

        <Link
          className="flex w-fit space-x-2 rounded text-lg leading-none tracking-wide font-medium text-orange-600 font-mono shadow hover:text-gray-400"
          href="/coding"
        >
          <LuMoveLeft className="text-xl" /> <span>projects</span>
        </Link>
      </article>
    </>
  )
}

export default Page

export const dynamicParams = false

export const generateStaticParams = (): { id: string }[] => {
  return projects_data.map((project) => ({
    id: project.id,
  }))
}

const getProject = (params: { id: string }) => {
  const project = projects_data.find((project) => project.id === params.id)
  if (!project) {
    throw new Error(`Project with id "${params.id}" not found`)
  }
  return project
}

export async function generateMetadata(props: ProjectProps): Promise<Metadata> {
  const params = await props.params
  const projectData = getProject({ id: params.id })
  return {
    title: projectData.title,
  }
}
