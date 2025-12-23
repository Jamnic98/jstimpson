import type { Meta, StoryObj } from '@storybook/react-vite'

import Page from 'app/home-page'

const meta = {
  title: 'Pages/Home',
  component: Page,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Page>

export default meta

type Story = StoryObj<typeof meta>

export const HomeStory: Story = {
  args: { allActivityData: {} },
}
