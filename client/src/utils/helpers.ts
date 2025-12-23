import projects from 'data/projects'
import { type Project } from 'types'

export const reduceSumFunc = (prev: number, cur: number) => prev + cur

export const getRandomElement = <T>(array: T[]) => array[Math.floor(Math.random() * array.length)]

export const fetchActivities = async (type?: string, timestamp?: number) => {
  const url = new URL('/activities', process.env.NEXT_PUBLIC_SERVER_URL as string)
  if (timestamp) {
    url.searchParams.append('after', timestamp.toString())
  }
  if (type) {
    url.searchParams.append('type', type)
  }

  try {
    const response = await fetch(
      url.toString(),
      // revalidate every 12 hours
      { next: { revalidate: 43200 } }
    )
    if (!response.ok) {
      throw new Error(`Failed to fetch running data`)
    }

    const { activities } = await response.json()
    return activities
  } catch (error) {
    console.error(error)

    // Different error messages based on the type of error
    if (error instanceof SyntaxError) {
      // This handles JSON parsing errors
      throw new Error('Failed to parse the running data')
    } else if (error instanceof TypeError) {
      // This handles network errors (e.g., failed to fetch)
      throw new Error('Network error: Failed to connect to the server')
    } else if (error instanceof Error) {
      // If it's a custom error or response error (non-specific)
      throw new Error(`Unexpected error: ${error.message}`)
    } else {
      // Fallback if the error is of an unknown type
      throw new Error('An unknown error occurred while fetching running data')
    }
  }
}

export const leastSquares = (xSeries: number[], ySeries: number[]) => {
  const xBar = (xSeries.reduce(reduceSumFunc, 0) * 1.0) / xSeries.length
  const yBar = (ySeries.reduce(reduceSumFunc, 0) * 1.0) / ySeries.length

  const ssXX = xSeries.map((d) => Math.pow(d - xBar, 2)).reduce(reduceSumFunc, 0)

  const ssYY = ySeries.map((d) => Math.pow(d - yBar, 2)).reduce(reduceSumFunc, 0)

  const ssXY = xSeries.map((d, i) => (d - xBar) * (ySeries[i] - yBar)).reduce(reduceSumFunc, 0)

  const slope = ssXY / ssXX
  const intercept = yBar - xBar * slope
  const rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY)

  return [slope, intercept, rSquare]
}

export const projectCodingLanguages = [
  ...Array.from(
    new Set(projects.map((projectData: Project) => projectData.mainLanguage).flat())
  ).sort((a, b) => a.localeCompare(b)),
]
