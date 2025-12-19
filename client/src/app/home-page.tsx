'use client'

import { Suspense } from 'react'
import Link from 'next/link'

import { PageHeader, Explorer, RunningStats, Loader } from 'components'
import { type Project, type RunData } from 'types'
import projects from 'data/projects'

interface HomePageProps {
  runData: RunData[]
}

const FeaturedProjects = ({ projects }: { projects: Partial<Project>[] }) => (
  <section className="my-12">
    <Explorer title="Featured Projects" projectData={projects} />
  </section>
)

const RunningSection = ({ runData }: { runData: RunData[] }) => (
  <section className="my-12">
    <h2 className="mb-0 text-3xl font-semibold">
      {new Date().toLocaleString('default', { month: 'long' })} Running
    </h2>
    <hr className="my-4 border-gray-300" />
    <div className="mb-4">
      <RunningStats runData={runData} />
    </div>
    <div className="my-4 flex justify-center">
      <Link className="group" href="/logs">
        <span className="text-xl font-medium text-orange-600 group-hover:text-gray-950">
          - all stats -
        </span>
      </Link>
    </div>
  </section>
)

const HomePage: React.FC<HomePageProps> = ({ runData }) => {
  const filteredProjects = projects
    .filter((project) =>
      [
        'alt-world',
        'inventory-management-system',
        'ollama-chat-app',
        'poker-simulator',
        'portfolio-website',
        'uk-garden-bird-classifier-app',
      ].includes(project.id)
    )
    .slice(0, 6)
    .map(({ id, title, summary, projectPageURI }) => ({
      id,
      title,
      summary,
      projectPageURI,
    }))

  return (
    <>
      <PageHeader title="Home" description="Hello and welcome to my portfolio website." />

      <article className="mb-16">
        <section className="my-12">
          <p className="mb-4 text-justify text-xl">
            I designed and built this site from the ground up with Next.js, React, TypeScript,
            Python, FastAPI, and MongoDB. Take a look at the adaptive typing app I'm working on,
            called{' '}
            <Link
              href="https://typation.co.uk"
              className="text-orange-600 hover:text-gray-950"
              target="_blank"
              rel="noopener noreferrer"
            >
              Typation
            </Link>{' '}
            which is currently deployed in public alpha where anyone can try it out for free!
          </p>
        </section>

        {/* Projects */}
        <Suspense
          fallback={
            <div className="flex justify-center">
              <Loader />
            </div>
          }
        >
          <FeaturedProjects projects={filteredProjects} />
        </Suspense>

        {/* Running data */}
        <Suspense
          fallback={
            <div className="flex justify-center">
              <Loader />
            </div>
          }
        >
          <RunningSection runData={runData} />
        </Suspense>
      </article>
    </>
  )
}

export default HomePage
