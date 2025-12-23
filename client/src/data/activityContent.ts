export interface ActivityContent {
  title: string
  description: string
  routineText: string
}

export const activityContentMap: Record<string, ActivityContent> = {
  Run: {
    title: 'Running',
    description: 'Here is my running data.',
    routineText:
      'Since 2020, I have developed a regular running routine, aspiring to one day complete an ultramarathon. On the 22nd of October 2023, I ran the Battersea Park Marathon and raised £275 for The Alzheimer’s Society!',
  },
  Ride: {
    title: 'Cycling',
    description: 'Here is my cycling data.',
    routineText:
      'Since 2020, I have developed a regular cycling routine, enjoying long rides and training for various events.',
  },
}
