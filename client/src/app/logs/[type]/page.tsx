import { type Metadata } from 'next'

import { PageHeader, ActivityDataView } from '@/components'
import { fetchActivities } from '@/utils'
import { activityContentMap } from '@/data/activityContent'

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

export default async function Page(props: LogsProps) {
  const params = await props.params
  const typeParam = params.type?.toLowerCase()

  const fetchType = routeToFetchTypeMap[typeParam] || 'Run'
  const displayType = routeToDisplayMap[typeParam] || 'Running'

  const content = activityContentMap[fetchType] || {
    title: displayType,
    routineText: '',
  }

  const activitiesPromise = fetchActivities(fetchType)

  return (
    <>
      <PageHeader title={content.title} description={content.description} />
      <article className="mb-16 text-white">
        <section className="my-12">
          <ActivitiesDataSection activitiesPromise={activitiesPromise} type={typeParam} />
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
