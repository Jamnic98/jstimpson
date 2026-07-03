'use client'

import { Suspense, useMemo, useState } from 'react'
import Link from 'next/link'
import { IoOpenOutline } from 'react-icons/io5'

import { ActivityStats, Loader, PageHeader } from '@/components'
import { type Project, type ActivityData, LinkType } from '@/types'
import { extMap } from '@/utils/constants'
import projects from '@/data/projects'

const typeDisplayMap: Record<string, string> = {
  running: 'Running',
  cycling: 'Cycling',
}

interface HomePageProps {
  allActivityData: Record<string, ActivityData[]>
}

const FeaturedProjectCard = ({ project }: { project: Partial<Project> }) => {
  const primaryLang = project.mainLanguage?.[0] ?? 'TypeScript'
  const fileLabel = `${project.id}.${extMap[primaryLang] ?? 'tsx'}`
  const liveURL = project.links?.find((link) => link.type === LinkType.LIVE)?.URL

  return (
    <div className="group rounded-2xl bg-neutral-800 p-2 transition-colors hover:bg-neutral-700/70">
      <Link href={project.projectPageURI ?? '#'} className="block">
        <div className="overflow-hidden rounded-lg border border-neutral-700 bg-[#0B0D0C]">
          <div className="flex h-24 items-center justify-center px-4">
            <span className="truncate font-mono text-[11px] text-orange-500/80">{fileLabel}</span>
          </div>
        </div>

        <div className="mt-3">
          <h3 className="text-sm font-semibold text-neutral-300 transition-colors group-hover:text-orange-600">
            {project.title}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-neutral-500">{project.summary}</p>
        </div>
      </Link>

      <div className="mt-3 flex items-center justify-between border-t border-neutral-700/60 pt-2">
        <span className="font-mono text-[10px] uppercase tracking-wide text-orange-500">
          {primaryLang}
        </span>
        <div className="flex items-center gap-3">
          {liveURL && (
            <a
              href={liveURL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-full px-2 py-1 font-mono text-[10px]
                uppercase tracking-wide leading-none text-emerald-400 transition-colors
                hover:bg-orange-600/20"
            >
              <span>live</span>
              <IoOpenOutline className="h-3 w-3 shrink-0" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

const FeaturedProjects = ({ projectData }: { projectData: Partial<Project>[] }) => (
  <section className="my-12">
    <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400">
      selected work
    </p>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {projectData.map((project) => (
        <FeaturedProjectCard key={project.id} project={project} />
      ))}
    </div>
    <div className="mt-8 flex justify-center">
      <Link
        href="/coding"
        className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 transition-colors hover:text-orange-600"
      >
        - all projects -
      </Link>
    </div>
  </section>
)

const activityCountLabel: Record<string, string> = {
  running: 'runs logged',
  cycling: 'rides logged',
}

const HeroStats = ({
  projectCount,
  activityCount,
  activityType,
}: {
  projectCount: number
  activityCount: number
  activityType: string
}) => (
  <div className="flex gap-8 font-mono text-xs font-light">
    <div>
      <div className="uppercase tracking-widest text-neutral-400">projects</div>
      <div className="mt-1 text-sm text-white">{projectCount}</div>
    </div>
    <div>
      <div className="uppercase tracking-widest text-neutral-400">
        {activityCountLabel[activityType] ?? 'activities logged'}
      </div>
      <div className="mt-1 text-sm text-white">{activityCount}</div>
    </div>
    <div>
      <div className="uppercase tracking-widest text-neutral-400">status</div>
      <div className="mt-1 text-sm text-emerald-400">available</div>
    </div>
  </div>
)

// Restyled to match the pagination/pill language used elsewhere — mono, uppercase,
// active state as a filled orange chip inside a bordered dark track.
const ActivityTypeSelector = ({
  selected,
  types,
  onSelect,
}: {
  selected: string
  types: string[]
  onSelect: (type: string) => void
}) => (
  <div className="flex h-fit w-fit rounded-lg border border-neutral-700 bg-neutral-900 p-0.5 font-mono text-[11px] uppercase tracking-widest">
    {types.map((type) => (
      <button
        key={type}
        type="button"
        onClick={() => onSelect(type)}
        className={`cursor-pointer rounded-md px-3 py-1.5 transition-colors ${
          selected === type
            ? 'bg-orange-600/20 text-orange-500'
            : 'text-neutral-500 hover:text-neutral-300'
        }`}
      >
        {typeDisplayMap[type] ?? type}
      </button>
    ))}
  </div>
)

const HomePage: React.FC<HomePageProps> = ({ allActivityData }) => {
  const FEATURED_IDS = ['alt-world', 'scrabble-scorekeeper', 'typation']
  const currentYear = new Date().getFullYear()

  const activityTypes = Object.keys(allActivityData)
  const [selectedType, setSelectedType] = useState('running')

  // All-time count for the hero — unaffected by the monthly filter below.
  const activityCount = allActivityData[selectedType]?.length ?? 0

  // Monthly view for the activity stats panel, filtered from the full fetch.
  const monthlyActivities = useMemo(() => {
    const now = new Date()
    const startOfMonthUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)

    return (allActivityData[selectedType] ?? []).filter((activity) => {
      const activityTime = new Date(activity.start_date_local).getTime()
      return activityTime >= startOfMonthUTC
    })
  }, [allActivityData, selectedType])

  const featuredProjects = projects
    .filter((project) => FEATURED_IDS.includes(project.id))
    .map(({ id, title, summary, projectPageURI, links }) => ({
      id,
      title,
      summary,
      projectPageURI,
      links,
    }))

  return (
    <>
      <p className="text-orange-600 font-mono tracking-wide">PORTFOLIO — {currentYear}</p>

      <PageHeader
        title="Full-stack Engineer & aspiring 3D artist"
        description="Building things with Next.js, Python, and Blender."
      />

      <hr className="my-6 w-full border-none bg-gray-600" style={{ height: '0.1px' }} />

      <div className="flex justify-between flex-wrap gap-8">
        <HeroStats
          projectCount={projects.length}
          activityCount={activityCount}
          activityType={selectedType}
        />

        <ActivityTypeSelector
          selected={selectedType}
          types={activityTypes}
          onSelect={setSelectedType}
        />
      </div>

      <div className="my-12">
        <Suspense
          fallback={
            <div className="flex justify-center">
              <Loader />
            </div>
          }
        >
          <FeaturedProjects projectData={featuredProjects} />
        </Suspense>
      </div>

      <div className="flex items-end justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400">
          {new Date().toLocaleString('default', { month: 'long' })} {typeDisplayMap[selectedType]}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-600 bg-neutral-800 p-4">
        <ActivityStats activityData={monthlyActivities} unit="metric" />
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href={`/logs/${selectedType}`}
          className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 transition-colors hover:text-orange-600"
        >
          - all activities -
        </Link>
      </div>
    </>
  )
}

export default HomePage
