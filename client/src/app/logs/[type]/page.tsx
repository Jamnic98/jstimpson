import { type Metadata } from 'next'

import { PageHeader, ActivityDataView } from 'components'
import { fetchActivities } from 'utils'

const routeToFetchTypeMap: Record<string, 'Run' | 'Ride'> = {
  running: 'Run',
  cycling: 'Ride',
}

const routeToDisplayMap: Record<string, string> = {
  running: 'Running',
  cycling: 'Cycling',
}

export const metadata: Metadata = {
  title: 'Activity Logs',
}

interface LogsProps {
  params: Promise<{ type: string }>
}

import { activityContentMap } from 'data/activityContent'

export default async function Page(props: LogsProps) {
  const params = await props.params
  const typeParam = params.type
  const fetchType = routeToFetchTypeMap[typeParam] // 'Run' or 'Ride'
  const displayType = routeToDisplayMap[typeParam] // 'Running' or 'Cycling'

  const content = activityContentMap[fetchType] || {
    title: displayType,
    description: `Here is my ${displayType.toLowerCase()} data.`,
    routineText: '',
  }

  const activitiesPromise = fetchActivities(fetchType)

  return (
    <>
      <PageHeader title={content.title} description={content.description} />
      <article className="mb-16">
        {/* <section className="my-12">
          <p className="mb-4 text-justify text-xl">{content.description}</p>
          <p className="mb-4 text-justify text-xl">{content.routineText}</p>
        </section> */}

        <section className="my-12">
          <ActivitiesDataSection activitiesPromise={activitiesPromise} type={params.type} />
        </section>
      </article>
    </>
  )
}

async function ActivitiesDataSection({
  activitiesPromise,
  type,
}: {
  activitiesPromise: ReturnType<typeof fetchActivities>
  type: string
}) {
  const activities = await activitiesPromise
  return <ActivityDataView activityData={activities} activityType={type} />
}
