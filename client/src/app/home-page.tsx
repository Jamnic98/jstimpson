'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'

import { PageHeader, Explorer, ActivityStats, Loader } from 'components'
import { type Project, type ActivityData } from 'types'
import projects from 'data/projects'

const typeDisplayMap: Record<string, string> = {
  running: 'Running',
  cycling: 'Cycling',
}
interface HomePageProps {
  allActivityData: Record<string, ActivityData[]>
}

const ActivityTypeSelector = ({
  selected,
  types,
  onSelect,
}: {
  selected: string
  types: string[]
  onSelect: (type: string) => void
}) => (
  <div className="flex gap-2 flex-col sm:flex-row">
    {types.map((type) => (
      <button
        key={type}
        onClick={() => onSelect(type)}
        className={`px-4 py-2 rounded-full font-medium cursor-pointer outline-none ${
          selected === type
            ? 'bg-orange-600 text-white'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        }`}
      >
        {typeDisplayMap[type]}
      </button>
    ))}
  </div>
)

const FeaturedProjects = ({ projects }: { projects: Partial<Project>[] }) => (
  <section className="my-12">
    <Explorer title="Featured Projects" projectData={projects} />
  </section>
)

const HomePage: React.FC<HomePageProps> = ({ allActivityData }) => {
  const activityTypes = Object.keys(allActivityData)
  const [selectedType, setSelectedType] = useState('running')

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
            which is currently deployed and available to try!
          </p>
        </section>

        <Suspense
          fallback={
            <div className="flex justify-center">
              <Loader />
            </div>
          }
        >
          <FeaturedProjects projects={filteredProjects} />
        </Suspense>

        <section className="my-12">
          <div className="flex justify-between space-x-2">
            <h2 className="mb-0 text-3xl font-semibold">
              {new Date().toLocaleString('default', { month: 'long' })}{' '}
              {typeDisplayMap[selectedType]}
            </h2>
            {/* Activity type selector */}
            <ActivityTypeSelector
              selected={selectedType}
              types={activityTypes}
              onSelect={setSelectedType}
            />
          </div>
          <hr className="my-4 border-gray-300" />
          <ActivityStats activityData={allActivityData[selectedType]} type={selectedType} />
          <div className="my-4 flex justify-center">
            <Link className="group" href={`/logs/${selectedType}`}>
              <span className="text-xl font-medium text-orange-600 group-hover:text-gray-950">
                {`- all ${typeDisplayMap[selectedType].toLowerCase()} stats -`}
              </span>
            </Link>
          </div>
        </section>
      </article>
    </>
  )
}

export default HomePage
