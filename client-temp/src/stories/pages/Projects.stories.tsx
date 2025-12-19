import type { Meta, StoryObj } from '@storybook/react-vite'

import Page from 'app/coding/projects-page'

const meta = {
  title: 'Pages/Projects',
  component: Page,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Page>

export default meta

type Story = StoryObj<typeof meta>

export const ProjectsStory: Story = {}
