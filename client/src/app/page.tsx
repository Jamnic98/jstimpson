import { type Metadata } from 'next'

import HomePage from './home-page'
import { getRunningData } from 'utils'

export const metadata: Metadata = {
  title: 'Home',
}

export default async function Page() {
  // get 1st of current month
  const date = new Date()
  date.setUTCDate(1)
  date.setUTCHours(0, 0, 0, 0)

  // get running data from the 1st of the current month
  const runs = await getRunningData(date.getTime())

  return <HomePage runData={runs} />
}
