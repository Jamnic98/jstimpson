export const revalidate = 43200

import { type Metadata } from 'next'

import HomePage from './home-page'
import { fetchActivities } from 'utils'

export const metadata: Metadata = {
  title: 'Home',
}

export default async function Page() {
  const now = new Date()
  const startOfMonthUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))

  // Fetch activities (default type optional)
  const data = await fetchActivities(undefined, startOfMonthUTC.getTime())

  // Reshape to keyed by type
  const allActivityData: Record<string, any[]> = {
    running: [],
    cycling: [],
  }

  data.forEach((activity: any) => {
    const type = activity.sport_type === 'Run' ? 'running' : 'cycling'
    allActivityData[type].push(activity)
  })

  return <HomePage allActivityData={allActivityData} />
}
