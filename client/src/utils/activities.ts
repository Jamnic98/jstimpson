export const kmToMiles = (distanceInKm: number) => distanceInKm * 0.621371

export const getAverageDurationString = (averageDurationInSeconds: number) =>
  `Average run time: ${secondsToDhms(averageDurationInSeconds)}`

export const getAverageDistanceString = (
  averageDistanceInMeters: number,
  unit?: 'metric' | 'imperial'
) => {
  const averageDistanceInKm = averageDistanceInMeters === 0 ? 0 : averageDistanceInMeters / 1000
  const kmString = `${averageDistanceInKm.toFixed(2)} km`
  const miString = `${kmToMiles(averageDistanceInKm).toFixed(2)} mi`

  if (unit === 'metric') return `Average distance: ${kmString}`
  if (unit === 'imperial') return `Average distance: ${miString}`

  // Fallback to original layout if no unit passed
  return `Average distance: ${kmString} / ${miString}`
}

export const getTotalDistanceString = (
  totalDistanceInMeters: number,
  unit?: 'metric' | 'imperial'
): string => {
  const totalDistanceInKm = totalDistanceInMeters / 1000
  const kmString = `${totalDistanceInKm.toFixed(2)} km`
  const miString = `${kmToMiles(totalDistanceInKm).toFixed(2)} mi`

  if (unit === 'metric') return `Total distance: ${kmString}`
  if (unit === 'imperial') return `Total distance: ${miString}`

  return `Total distance: ${kmString} / ${miString}`
}

export const getFurthestDistanceString = (
  furthestDistanceInMeters: number,
  unit?: 'metric' | 'imperial'
): string => {
  const distanceInKm = furthestDistanceInMeters === 0 ? 0 : furthestDistanceInMeters / 1000
  const kmString = `${distanceInKm.toFixed(2)} km`
  const miString = `${kmToMiles(distanceInKm).toFixed(2)} mi`

  if (unit === 'metric') return `Furthest distance: ${kmString}`
  if (unit === 'imperial') return `Furthest distance: ${miString}`

  return `Furthest distance: ${kmString} / ${miString}`
}

export const getTotalDurationString = (totalDuration: number) =>
  `Total duration: ${secondsToDhms(totalDuration)}`

export const secondsToDhms = (seconds: number): string => {
  if (seconds === 0) {
    return '-'
  } else {
    const d = Math.floor(seconds / (3600 * 24))
    const h = Math.floor((seconds % (3600 * 24)) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)

    const dDisplay = d > 0 ? d + 'D' : ''
    const hDisplay = h > 0 ? h + 'h' : ''
    const mDisplay = m > 0 ? m + 'm' : ''
    const sDisplay = s > 0 ? s + 's' : ''
    return `${dDisplay} ${hDisplay} ${mDisplay} ${sDisplay}`.trim().replace(/\s+/g, ' ')
  }
}
