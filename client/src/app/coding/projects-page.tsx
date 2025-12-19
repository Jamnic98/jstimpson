'use client'

import { useState } from 'react'

import { PageHeader, ProjectsCarousel, Select } from 'components'
import { projectCodingLanguages } from 'utils'
import projects from 'data/projects'
import { type Project } from 'types'

const defaultSelectValue = 'All'

export default function ProjectsPage() {
  const [language, setLanguage] = useState(defaultSelectValue)

  const filteredProjects: Project[] = projects.filter(
    (projectData: Project) =>
      language === defaultSelectValue || projectData.mainLanguage.includes(language)
  )

  return (
    <>
      <PageHeader
        title="Coding Projects"
        description="A collection of personal programming projects I’ve built."
      />

      <article>
        <section className="my-4">
          <label className="mb-4 block text-xl">Filter by coding language:</label>
          <Select defaultValue="All" items={projectCodingLanguages} onChange={setLanguage} />

          <ProjectsCarousel items={filteredProjects} />
        </section>
      </article>
    </>
  )
}
