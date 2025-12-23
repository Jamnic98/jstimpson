import { type Metadata } from 'next'

import HomePage from './home-page'
import { fetchActivities } from 'utils'

export const metadata: Metadata = {
  title: 'Home',
}

export default async function Page() {
  const date = new Date()
  date.setUTCDate(1)
  date.setUTCHours(0, 0, 0, 0)

  // Fetch activities (default type optional)
  const data = await fetchActivities(undefined, date.getTime())

  // Reshape to keyed by type
  const allActivityData: Record<string, any[]> = {}

  data.forEach((activity: any) => {
    const type = activity.sport_type === 'Run' ? 'running' : 'cycling'
    if (!allActivityData[type]) allActivityData[type] = []
    allActivityData[type].push(activity)
  })

  return <HomePage allActivityData={allActivityData} />
}
