import type { Meta, StoryObj } from '@storybook/react-vite'

import Page from 'app/logs/page'

const meta = {
  title: 'Pages/Running',
  component: Page,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Page>

export default meta

type Story = StoryObj<typeof meta>

export const RunningStory: Story = {}
