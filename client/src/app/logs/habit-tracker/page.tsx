import { type Metadata } from 'next'

import { HabitTrackerView, PageHeader } from '@/components'
import { fetchActivitySummary, fetchGoalProgress } from '@/utils'

export const metadata: Metadata = {
  title: 'Habit Tracker',
}

export default async function Page() {
  const month = new Date().toISOString().slice(0, 7)

  const [running, cycling, goalProgress] = await Promise.all([
    fetchActivitySummary('Run'),
    fetchActivitySummary('Ride'),
    fetchGoalProgress(month),
  ])

  return (
    <>
      <PageHeader
        title="Habit Tracker"
        description="Strava-verified activity stats: streaks, weekly volume, and monthly goal progress."
      />
      <article className="mb-16 text-white">
        <HabitTrackerView
          summaries={{ running, cycling }}
          goalProgress={goalProgress.goals}
          month={month}
        />
      </article>
    </>
  )
}
