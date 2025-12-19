export const kmToMiles = (distanceInKm: number) => distanceInKm * 0.621371

export const getAverageDurationString = (averageDurationInSeconds: number) =>
  `Average run time: ${secondsToDhms(averageDurationInSeconds)}`

export const getAverageDistanceString = (averageDistanceInMeters: number) => {
  const averageDistanceInKm = averageDistanceInMeters === 0 ? 0 : averageDistanceInMeters / 1000
  return `Average distance: ${averageDistanceInKm.toFixed(2)}km / ${kmToMiles(
    averageDistanceInKm
  ).toFixed(2)}mi`
}

export const getTotalDistanceString = (totalDistanceInMeters: number): string => {
  const totalDistanceInKm = totalDistanceInMeters / 1000
  return `Total distance: ${totalDistanceInKm.toFixed(2)}km / ${kmToMiles(
    totalDistanceInKm
  ).toFixed(2)}mi`
}

export const getFurthestDistanceString = (furthestDistanceInMeters: number): string => {
  const distanceInKm = furthestDistanceInMeters === 0 ? 0 : furthestDistanceInMeters / 1000
  return `Furthest distance: ${distanceInKm.toFixed(2)}km / ${kmToMiles(distanceInKm).toFixed(2)}mi`
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
    return `${dDisplay} ${hDisplay} ${mDisplay} ${sDisplay}`
  }
}
