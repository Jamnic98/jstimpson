import type { Meta, StoryObj } from '@storybook/react-vite'

import Page from 'app/about/page'

const meta = {
  title: 'Pages/About Me',
  component: Page,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Page>

export default meta

type Story = StoryObj<typeof meta>

export const AboutMeStory: Story = {}
