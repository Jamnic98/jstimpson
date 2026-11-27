'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { IoOpenOutline } from 'react-icons/io5'

import { Loader, PageHeader } from '@/components'
import { type Project, LinkType } from '@/types'
import { extMap } from '@/utils/constants'
import projects from '@/data/projects'

const FeaturedProjectCard = ({ project }: { project: Partial<Project> }) => {
  const primaryLang = project.mainLanguage?.[0] ?? 'TypeScript'
  const fileLabel = `${project.id}.${extMap[primaryLang] ?? 'tsx'}`
  const liveURL = project.links?.find((link) => link.type === LinkType.LIVE)?.URL
  const previewImage = project.screenshotURIs?.[0]

  return (
    <div className="group rounded-2xl bg-neutral-800 p-2 transition-colors hover:bg-neutral-700/70">
      <Link href={project.projectPageURI ?? '#'} className="block">
        <div className="overflow-hidden rounded-lg border border-neutral-700 bg-[#0B0D0C]">
          {previewImage ? (
            <div className="relative aspect-video w-full">
              <Image
                src={previewImage}
                alt={project.title ?? 'Project preview'}
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center px-4">
              <span className="truncate font-mono text-[11px] text-orange-500/80">{fileLabel}</span>
            </div>
          )}
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

const HeroStats = ({ projectCount }: { projectCount: number }) => (
  <div className="flex gap-8 font-mono text-xs font-light">
    <div>
      <div className="uppercase tracking-widest text-neutral-400">projects</div>
      <div className="mt-1 text-sm text-white">{projectCount}</div>
    </div>
    <div>
      <div className="uppercase tracking-widest text-neutral-400">status</div>
      <div className="mt-1 text-sm text-emerald-400">available</div>
    </div>
  </div>
)

const HomePage: React.FC = () => {
  const FEATURED_IDS = ['alt-world', 'scrabble-scorekeeper', 'typation']
  const currentYear = new Date().getFullYear()

  const featuredProjects = projects
    .filter((project) => FEATURED_IDS.includes(project.id))
    .map(({ id, title, summary, projectPageURI, links, screenshotURIs }) => ({
      id,
      title,
      summary,
      projectPageURI,
      links,
      screenshotURIs,
    }))

  return (
    <>
      <p className="text-orange-600 font-mono tracking-wide">PORTFOLIO — {currentYear}</p>

      <PageHeader
        title="Full-stack Engineer & aspiring 3D artist"
        description="Building things with Next.js, Go, and Blender."
      />

      <hr className="my-6 w-full border-none bg-gray-600" style={{ height: '0.1px' }} />

      <div className="flex justify-between flex-wrap gap-8">
        <HeroStats projectCount={projects.length} />
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
    </>
  )
}

export default HomePage
