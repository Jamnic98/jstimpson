import { type Metadata } from 'next'

import HomePage from '@/app/home-page'
import { fetchActivities } from '@/utils'
import { ActivityData } from '@/types'

export const metadata: Metadata = {
  title: 'Home',
}

export default async function Page() {
  // const now = new Date()
  // const startOfMonthUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))

  // Fetch activities (default type optional)
  const data = await fetchActivities(/* undefined, startOfMonthUTC.getTime() */)

  // Reshape to keyed by type
  const allActivityData: Record<string, ActivityData[]> = {
    running: [],
    cycling: [],
    // Optional: Add walking if you want to track it separately instead of ignoring it
    // walking: [],
  }

  data.forEach((activity: any) => {
    // Explicitly check the sport type to avoid miscategorizing walks, hikes, etc.
    if (activity.sport_type === 'Run') {
      allActivityData.running.push(activity)
    } else if (activity.sport_type === 'Ride' || activity.sport_type === 'VirtualRide') {
      // Add any other cycling-related sport types your API returns (e.g., 'Cycling', 'EBikeRide')
      if (!allActivityData.cycling) allActivityData.cycling = []
      allActivityData.cycling.push(activity)
    }
    // Activities like 'Walk', 'Hike', etc., will now be safely skipped
    // unless you add a specific array for them above.
  })

  return <HomePage allActivityData={allActivityData} />
}
