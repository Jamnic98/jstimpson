import Link from 'next/link'

import { type Project } from 'types'

interface ExplorerProps {
  title: string
  projectData: Partial<Project>[]
}

export const Explorer: React.FC<ExplorerProps> = ({ title, projectData }) => (
  <>
    <h2 className="mb-0 text-3xl font-semibold">{title}</h2>
    <hr className="my-4 border-gray-300" />

    {/* Project links */}
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {projectData.map((dataObj, index) => (
        <Link
          key={index}
          href={dataObj.projectPageURI || ''}
          className="group col-span-1 block rounded bg-neutral-50 p-4 shadow transition-all duration-200 ease-in-out hover:scale-[101%] hover:cursor-pointer hover:shadow-md"
        >
          {/* Project name */}
          <h3 className="mb-2 text-2xl font-medium text-orange-600 group-hover:text-gray-950">
            {dataObj.title}
          </h3>

          {/* Project description */}
          <div className="line-clamp-2 h-14 text-xl text-gray-950">{dataObj.summary}</div>
        </Link>
      ))}
    </div>

    {/* All projects button */}
    <div className="my-4 flex justify-center">
      <Link className="group" href="/coding">
        <span className="text-xl font-medium text-orange-600 group-hover:text-gray-950">
          - all projects -
        </span>
      </Link>
    </div>
  </>
)
